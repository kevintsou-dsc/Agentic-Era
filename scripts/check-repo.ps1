# 推送前檢查：git 追蹤清單不得含原始素材或機密樣式的檔案（見 docs/PRD.md §9.2）
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$files = git -C $root ls-files
$bad = $files | Where-Object { $_ -match '\.(pdf|indd|idml|indb|xlsx|ai|psd|pem|key)$' -or $_ -match '(^|/)\.env' }
$secretHits = $files | Where-Object { $_ -match '\.(json|md|ts|js|py|mjs|astro|txt)$' } | ForEach-Object {
    $path = Join-Path $root $_
    if (Select-String -LiteralPath $path -Pattern '"private_key"\s*:|BEGIN [A-Z ]*PRIVATE KEY|AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{35}|[A-Za-z0-9._%+-]+@dentsu\.com' -Quiet) { $_ }
}
if ($bad -or $secretHits) {
    Write-Host "BLOCKED" -ForegroundColor Red
    $bad + $secretHits | ForEach-Object { Write-Host "  $_" }
    exit 1
}
Write-Host "OK: $($files.Count) tracked files, no source assets or secret patterns"
