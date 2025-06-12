export function mapTableToHTML(viewOnlyTable?: HTMLElement): string {
	if (viewOnlyTable) {
		const clone = viewOnlyTable.cloneNode(true);
		const tableElement = clone.firstChild as HTMLTableElement;
		stripHtmlTags(tableElement.children);
		return tableElement.innerHTML
			.replaceAll('<!---->', '');
	}
	return 'Error';
}

function stripHtmlTags(nodes: HTMLCollection): void {
	[...nodes].forEach(node => {
		node.removeAttribute?.('id');
		node.removeAttribute?.('class');
		node.removeAttribute?.('style');
		stripHtmlTags(node.children);
	});
}
