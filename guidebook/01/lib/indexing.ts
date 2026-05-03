import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DirectoryLoader } from "@langchain/classic/document_loaders/fs/directory";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { vectorStore } from "./chromadb";

// 1. load
const exampleDataPath = "../documents/";

const directoryLoader = new DirectoryLoader(exampleDataPath, {
  ".pdf": (path: string) => new PDFLoader(path),
});

const docs = await directoryLoader.load();
console.log(docs[0]);

// 2. split
const splitted = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});
const splittedDoc = await splitted.splitDocuments(docs);
console.log(`Split into ${splittedDoc.length} sub-documents.`);
// 3. embedding
//4. store to db
const cleanDoc = splittedDoc.map((doc) => ({
  ...doc,
  metadata: {
    ...doc.metadata,
    pdf: JSON.stringify(doc.metadata.pdf ?? {}),
  },
}));
await vectorStore.addDocuments(cleanDoc);
