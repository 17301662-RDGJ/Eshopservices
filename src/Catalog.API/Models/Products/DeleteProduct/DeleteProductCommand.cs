namespace Catalog.API.Products.DeleteProduct;

public record DeleteProductCommand(Guid Id) : IRequest<DeleteProductResult>;

public record DeleteProductResult(bool IsSuccess);