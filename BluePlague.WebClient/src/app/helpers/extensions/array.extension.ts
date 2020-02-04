export function removeFromArray<T>(array: T[], object: T): boolean {
    const index = array.indexOf(object, 0);
    if (index > -1) {
        array.splice(index, 1);
        return true;
    }
    return false;
}
