using Marten;
using Catalog.API.Models.Products;

namespace Catalog.API.Products.DeleteProduct;

public class DeleteProductCommandHandler
    (IDocumentSession session)
    : IRequestHandler<DeleteProductCommand, DeleteProductResult>
{
    public async Task<DeleteProductResult> Handle(DeleteProductCommand command, CancellationToken cancellationToken)
    {
        // 1. Verificar si el producto existe
        var product = await session.LoadAsync<Product>(command.Id, cancellationToken);

        if (product == null)
        {
            return new DeleteProductResult(false);
        }

        // 2. Eliminar el producto por ID
        session.Delete<Product>(command.Id);
        await session.SaveChangesAsync(cancellationToken);

        return new DeleteProductResult(true);
    }
}