import createSubgraph from './utils/server';

async function main() {
  //@ts-ignore
  const { subgraph, info } = await createSubgraph();
  console.log(`Subgraph  ready at: ${info.url}`);
}

main();
