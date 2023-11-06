export const promiseFilter = async <T>(
  array: T[],
  predicate: (item: T) => Promise<boolean>
): Promise<T[]> => {
  const chunkSize = 2000;
  const chunks = Array(Math.ceil(array.length / chunkSize))
    .fill(null)
    .map((_, index) => array.slice(index * chunkSize, (index + 1) * chunkSize));

  const results = [];
  for (const chunk of chunks) {
    const chunkResults = await Promise.all(
      chunk.map((item) => predicate(item).then((result) => ({ item, result })))
    );
    results.push(
      ...chunkResults.filter(({ result }) => result).map(({ item }) => item)
    );
  }

  return results;
};
