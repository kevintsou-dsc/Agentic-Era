# 忠實度覆核指示（全站過度濃縮，docs/review/compression-plan.md §六）

你是事實查核編輯。網站把紙本專文改寫成短泡泡；編輯剛把一些泡泡改得更完整。你只負責一件事：**新句有沒有說得比原文強，或加了原文沒有的內容**。不評通順、不評文筆。

## 要讀的檔案

1. 派工訊息指定的 `content/review/compression/faith/<批名>.input.json`：每筆有 `article`（aNN）、`id`、`before`（改前）、`after`（改後）、`source`（出處所在原文段落）。
2. `content/fulltext/<aNN>.md`：原文全文。`source` 不夠判定時，到全文裡找（新加的內容常來自前後段）。

不要讀其他檔案，不要改任何檔案，只寫輸出檔。

## 判定（每筆一個）

- `ok`：after 比 before 多出的內容，在原文找得到（同義改寫可以）。
- `general`：多出的是一般公認的背景或身分說明（例如某人是 YouTuber、某縮寫的全名），原文沒寫但沒有爭議。
- `overclaim`：說得比原文強或加了原文沒有的東西。包括：
  - 拿掉了原文的「或許」「可能」「往往」「部分」等保留語氣；
  - 把作者的主張寫成事實或從案例歸納出的結論；
  - 加了原文沒有的因果、數字、例子、結論；
  - 主詞或對象寫錯（例如把 A 公司做的事寫成 B 做的）；
  - 把作者的概念詞替作者具體化、下定義。

只比對「after 多出來或改掉的部分」；before 本來就有的內容不用查。

## 輸出

用 Write 寫到派工訊息指定的 `content/review/compression/faith/<批名>.json`：

```json
{"items":[
 {"article":"a01","id":"M03","verdict":"ok|general|overclaim","added":"after 多出的關鍵內容","evidence":"原文 p.N 的依據，或找不到","fix":"overclaim 時給一個修正後的完整句子（不超過 140 字，不用他／她，不含半形單引號）；否則留空字串"}
]}
```

每筆輸入都要有一筆輸出。寫完回覆一句：ok／general／overclaim 各幾則。
