export function downloadCollectionAsJSON(collection) {
    if (!collection || collection.length === 0) return;

    const exportData = {
        app: "ArtVista",
        version: "1.0",
        date: new Date().toISOString(),
        count: collection.length,
        items: collection
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `artvista-collection-${new Date().toISOString().split('T')[0]}.json`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
