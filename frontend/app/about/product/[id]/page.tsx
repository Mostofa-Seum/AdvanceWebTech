export default async function ProductPage({params}:{params: Promise<{id:string}>}){
    const product = await params;
    return(
        <>
        <h1>Product{product.id}</h1>        
        <p>This is the product page {product.id}</p>
        </>
    );
}