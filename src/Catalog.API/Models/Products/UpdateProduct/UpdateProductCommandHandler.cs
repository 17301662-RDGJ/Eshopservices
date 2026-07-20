using Marten;
using Catalog.API.Models.Products;

namespace Catalog.API.Products.UpdateProduct;

public class UpdateProductCommandHandler
    (IDocumentSession session)
    : IRequestHandler<UpdateProductCommand, UpdateProductResult>
{
    public async Task<UpdateProductResult> Handle(UpdateProductCommand command, CancellationToken cancellationToken)
    {
        // 1. Obtener el producto de la base de datos por su ID
        var product = await session.LoadAsync<Product>(command.Id, cancellationToken);

        if (product == null)
        {
            return new UpdateProductResult(false);
        }

        // 2. Actualizar las propiedades confirmadas en Product.cs
        product.Name = command.Name;
        product.Category = command.Category;
        product.Price = command.Price;

        // 3. Guardar cambios
        session.Update(product);
        await session.SaveChangesAsync(cancellationToken);

        return new UpdateProductResult(true);
    }
}