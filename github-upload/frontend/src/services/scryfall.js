import api from "@/services/api";



export async function fetchAutocompleteSuggestions(cardName) {
    try {
        const response = await api.get("/scryfall/autocomplete", {
            params: { query: cardName },
        });
        return response.data; // Return the card data
    } catch (error) {
        console.error("Error fetching card details:", error);
        throw error;
    }
}


// This function fetches full card details using Scryfall's /cards/named endpoint (or fuzzy, if you prefer)
export async function fetchCardDetails(query, searchSet = "") {
    try {
      // Build the params object dynamically
      const params = { query };
      if (searchSet) {
        params.searchSet = searchSet;
      }
  
      // Now call the API with the constructed params
      const response = await api.get("/scryfall/search", { params });
      return response.data; // Return the card data (adjust based on your API response structure)
    } catch (error) {
      console.error("Error fetching card details:", error);
      throw error;
    }
  }
  