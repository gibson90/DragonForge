async function searchCardByName(cardName) {
    const url = `https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(cardName)}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        
        const cardData = await response.json();
        console.log(cardData);
        return cardData;
    } catch (error) {
        console.error("Failed to fetch card:", error);
        return null;
    }
}

// Example usage
searchCardByName("The Myriad Pools").then(card => {
    if (card) {
        console.log(`Found card: ${card.name}`);
        console.log(`Image URL: ${card.image_uris?.normal || "No image available"}`);
    }
});
