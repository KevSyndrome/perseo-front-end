const BASE_URL= "http://localhost:8000"

//cargos

//GET cargos
export const getData = async () => {
    try {
        const response = await fetch(`${BASE_URL}/cargos`);
        return await response.json();
       } catch (error) {
           console.error("Error al obtener cargos:", error);
           throw error;
       }
};


