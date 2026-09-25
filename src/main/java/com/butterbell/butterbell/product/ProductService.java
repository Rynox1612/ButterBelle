package com.butterbell.butterbell.product;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product getProductById(UUID id) {
    return productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public Product updateProduct(UUID id, Product updatedProduct) {

    Product existingProduct = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));

    existingProduct.setProductName(updatedProduct.getProductName());
    existingProduct.setPrice(updatedProduct.getPrice());
    existingProduct.setCategory(updatedProduct.getCategory());

    return productRepository.save(existingProduct);
    }

    public void deleteProduct(UUID id) {
    productRepository.deleteById(id);
    }
}