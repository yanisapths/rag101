# 01

## What does this do?

This is a Q&A Agent that answer question about employee handbook of the TechCorp Company

## Set up Typscript project

```bash
bun init
```

```bash
bun add -d @types/bun
```

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

Packages

```bash
bun add langchain @langchain/core @langchain/community @langchain/textsplitters zod @langchain/ollama pdf-parse@^1 chromadb
```

### Create models

Chat model

```

```

Embedding model

```

```

Connect to Vector Db

```import { Chroma } from "@langchain/community/vectorstores/chroma";

const vectorStore = new Chroma(embeddings, {
  collectionName: "a-test-collection",
});
```

RAG Agent

### Indexing

```

```

### Retreival Agent

```

```
