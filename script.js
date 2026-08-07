const retext = async () => {
  try {
    setLoading(true);
    const response = await fetch("https://sol-api.sherstde.ru/");
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    setData(result); 
    console.log(result);
  } catch (err) {
    setError(err.message);
    console.error(err);
  } finally {
    setLoading(false);
  }
};