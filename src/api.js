const BASE_URL= "https://backend-tasks-production-1f22.up.railway.app"

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


