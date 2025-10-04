export const simpleCode = `console.log("A");
console.log("B");

function logD() {
  console.warn("D");
}

function logC() {
  console.log("C");
  logD()
}

logC();
`;
