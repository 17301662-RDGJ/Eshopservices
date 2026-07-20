using Marten;

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

        // 2. Actualizar las propiedades con los nuevos datos
        product.Name = command.Name;
        product.Category = command.Category;
        product.Description = command.Description;
        product.ImageFile = command.ImageFile;
        product.Price = command.Price;

        // 3. Guardar cambios en la base de datos
        session.Update(product);
        await session.SaveChangesAsync(cancellationToken);

        return new UpdateProductResult(true);
    }
}