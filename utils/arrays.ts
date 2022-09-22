// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function removeDuplicates(array: Array<any>, key: string) {
	if (key) {
		const knownValues: string[] = [];
		return array.filter((value) => {
			if (knownValues.includes(value[key])) {
				return false;
			} else {
				knownValues.push(value[key]);
				return true;
			}
		});
	}
	return [...new Set(array)];
}
