async function getLatLongFromAddress(address) {
    const baseUrl = 'https://api.pdok.nl/bzk/locatieserver/search/v3_1/suggest';
    const encodedAddress = encodeURIComponent(address);
    const queryParams = `?q=${encodedAddress}&fl=%2A&fq=type%3Aadres&rows=1&wt=json`;
    const url = `${baseUrl}${queryParams}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`HTTP error! Status: ${response.status}`);
            return null;
        }

        const data = await response.json();
        if (data.response.numFound === 0) {
            console.warn('No address found for the given input.');
            return null;
        }

        const doc = data.response.docs[0];
        const centroideLL = doc.centroide_ll;
        const weergavenaam = doc.weergavenaam;

        if (centroideLL && weergavenaam) {
            const [longitude, latitude] = centroideLL.replace('POINT(', '').replace(')', '').split(' ').map(Number);
            return { latitude, longitude, weergavenaam };
        } else {
            console.warn('Centroid or display name not found in response.');
            return null;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

