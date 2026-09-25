import java.util.ArrayList;
import java.util.Scanner;

// =========================
// PRODUCT CLASS
// =========================
class Product {
    private String productId;
    private String productName;
    private double price;
    private String category;

    public Product(String productId, String productName,
                   double price, String category) {
        this.productId = productId;
        this.productName = productName;
        this.price = price;
        this.category = category;
    }

    public String getProductId() {
        return productId;
    }

    public String getProductName() {
        return productName;
    }

    public double getPrice() {
        return price;
    }

    public String getCategory() {
        return category;
    }

    public void displayProduct() {
        System.out.printf("%-8s %-25s ₹%-10.2f %-15s%n",
                productId, productName, price, category);
    }
}


// =========================
// CUSTOMER CLASS
// =========================
class Customer {
    private String customerId;
    private String name;
    private String phoneNumber;
    private String address;

    public Customer(String customerId, String name,
                    String phoneNumber, String address) {
        this.customerId = customerId;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.address = address;
    }

    public String getCustomerId() {
        return customerId;
    }

    public String getName() {
        return name;
    }

    public void displayCustomer() {
        System.out.println("Customer ID : " + customerId);
        System.out.println("Name        : " + name);
        System.out.println("Phone       : " + phoneNumber);
        System.out.println("Address     : " + address);
    }
}


// =========================
// ORDER DETAIL CLASS
// =========================
class OrderDetail {
    private String orderDetailId;
    private Product product;
    private int quantity;

    public OrderDetail(String orderDetailId,
                       Product product,
                       int quantity) {
        this.orderDetailId = orderDetailId;
        this.product = product;
        this.quantity = quantity;
    }

    public double getSubtotal() {
        return product.getPrice() * quantity;
    }

    public void displayDetail() {
        System.out.printf(
                "%-25s x %-3d ₹%.2f%n",
                product.getProductName(),
                quantity,
                getSubtotal()
        );
    }
}


// =========================
// ORDER STATUS
// =========================
enum OrderStatus {
    PLACED,
    PREPARING,
    READY,
    DELIVERED,
    CANCELLED
}


// =========================
// ABSTRACT PAYMENT CLASS
// =========================
abstract class Payment {
    protected String paymentId;
    protected double amount;
    protected String paymentStatus;

    public Payment(String paymentId, double amount) {
        this.paymentId = paymentId;
        this.amount = amount;
        this.paymentStatus = "PENDING";
    }

    // Abstract method
    public abstract void processPayment();

    public void displayPayment() {
        System.out.println("Payment ID     : " + paymentId);
        System.out.printf("Amount         : ₹%.2f%n", amount);
        System.out.println("Payment Status : " + paymentStatus);
    }
}


// =========================
// CASH PAYMENT
// =========================
class CashPayment extends Payment {

    public CashPayment(String paymentId, double amount) {
        super(paymentId, amount);
    }

    @Override
    public void processPayment() {
        paymentStatus = "PAID";
        System.out.println("Cash payment received.");
    }
}


// =========================
// UPI PAYMENT
// =========================
class UpiPayment extends Payment {

    public UpiPayment(String paymentId, double amount) {
        super(paymentId, amount);
    }

    @Override
    public void processPayment() {
        paymentStatus = "PAID";
        System.out.println("UPI payment successful.");
    }
}


// =========================
// CARD PAYMENT
// =========================
class CardPayment extends Payment {

    public CardPayment(String paymentId, double amount) {
        super(paymentId, amount);
    }

    @Override
    public void processPayment() {
        paymentStatus = "PAID";
        System.out.println("Card payment successful.");
    }
}


// =========================
// ORDER CLASS
// =========================
class Order {
    private String orderId;
    private Customer customer;
    private String orderDate;
    private OrderStatus orderStatus;

    private ArrayList<OrderDetail> orderDetails;

    private Payment payment;

    public Order(String orderId, Customer customer, String orderDate) {
        this.orderId = orderId;
        this.customer = customer;
        this.orderDate = orderDate;
        this.orderStatus = OrderStatus.PLACED;
        this.orderDetails = new ArrayList<>();
    }

    public String getOrderId() {
        return orderId;
    }

    public double calculateTotal() {

        double total = 0;

        for (OrderDetail detail : orderDetails) {
            total += detail.getSubtotal();
        }

        return total;
    }

    public void addProduct(Product product, int quantity) {

        String detailId = "OD" + (orderDetails.size() + 1);

        OrderDetail detail =
                new OrderDetail(detailId, product, quantity);

        orderDetails.add(detail);
    }

    public void setPayment(Payment payment) {
        this.payment = payment;
    }

    public void displayOrder() {

        System.out.println("\n=================================");
        System.out.println("          BUTTERBELLE");
        System.out.println("=================================");

        System.out.println("Order ID   : " + orderId);
        System.out.println("Date       : " + orderDate);
        System.out.println("Customer   : " + customer.getName());
        System.out.println("Status     : " + orderStatus);

        System.out.println("\nProducts:");
        System.out.println("---------------------------------");

        for (OrderDetail detail : orderDetails) {
            detail.displayDetail();
        }

        System.out.println("---------------------------------");

        System.out.printf(
                "TOTAL: ₹%.2f%n",
                calculateTotal()
        );

        if (payment != null) {
            System.out.println("\nPayment:");
            payment.displayPayment();
        }

        System.out.println("=================================");
    }
}


// =========================
// MAIN BUTTERBELLE SYSTEM
// =========================
public class ButterbelleApp {

    static Scanner scanner = new Scanner(System.in);

    static ArrayList<Product> products = new ArrayList<>();
    static ArrayList<Customer> customers = new ArrayList<>();
    static ArrayList<Order> orders = new ArrayList<>();

    static int customerCounter = 1;
    static int orderCounter = 1;
    static int paymentCounter = 1;


    // =========================
    // MAIN
    // =========================
    public static void main(String[] args) {

        loadProducts();

        System.out.println("\n=================================");
        System.out.println("       WELCOME TO BUTTERBELLE");
        System.out.println("=================================");

        boolean running = true;

        while (running) {

            displayMenu();

            int choice = getInt("Enter your choice: ");

            switch (choice) {

                case 1:
                    viewProducts();
                    break;

                case 2:
                    registerCustomer();
                    break;

                case 3:
                    placeOrder();
                    break;

                case 4:
                    viewOrders();
                    break;

                case 5:
                    makePayment();
                    break;

                case 6:
                    running = false;
                    System.out.println(
                            "\nThank you for using Butterbelle!"
                    );
                    break;

                default:
                    System.out.println(
                            "Invalid choice. Try again."
                    );
            }
        }

        scanner.close();
    }


    // =========================
    // MENU
    // =========================
    static void displayMenu() {

        System.out.println("\n----------- MENU -----------");
        System.out.println("1. View Products");
        System.out.println("2. Register Customer");
        System.out.println("3. Place Order");
        System.out.println("4. View Orders");
        System.out.println("5. Make Payment");
        System.out.println("6. Exit");
        System.out.println("----------------------------");
    }


    // =========================
    // LOAD PRODUCTS
    // =========================
    static void loadProducts() {

        // Sample Butterbelle products
        products.add(
                new Product(
                        "P001",
                        "Nutella Cheesecake",
                        500,
                        "Cheesecake"
                )
        );

        products.add(
                new Product(
                        "P002",
                        "Tiramisu",
                        450,
                        "Dessert"
                )
        );

        products.add(
                new Product(
                        "P003",
                        "Chocolate Brownie",
                        180,
                        "Brownie"
                )
        );

        products.add(
                new Product(
                        "P004",
                        "Red Velvet Cake",
                        550,
                        "Cake"
                )
        );
    }


    // =========================
    // VIEW PRODUCTS
    // =========================
    static void viewProducts() {

        System.out.println("\n---------------- PRODUCTS ----------------");

        System.out.printf(
                "%-8s %-25s %-12s %-15s%n",
                "ID", "Product", "Price", "Category"
        );

        System.out.println("-------------------------------------------");

        for (Product product : products) {
            product.displayProduct();
        }
    }


    // =========================
    // REGISTER CUSTOMER
    // =========================
    static void registerCustomer() {

        scanner.nextLine();

        System.out.println("\n------ CUSTOMER REGISTRATION ------");

        System.out.print("Enter name: ");
        String name = scanner.nextLine();

        System.out.print("Enter phone number: ");
        String phone = scanner.nextLine();

        System.out.print("Enter address: ");
        String address = scanner.nextLine();

        String customerId =
                String.format("C%03d", customerCounter++);

        Customer customer =
                new Customer(
                        customerId,
                        name,
                        phone,
                        address
                );

        customers.add(customer);

        System.out.println(
                "\nCustomer registered successfully!"
        );

        System.out.println("Customer ID: " + customerId);
    }


    // =========================
    // PLACE ORDER
    // =========================
    static void placeOrder() {

        if (customers.isEmpty()) {

            System.out.println(
                    "\nPlease register a customer first."
            );

            return;
        }

        System.out.println("\n------ PLACE ORDER ------");

        System.out.print("Enter Customer ID: ");
        String customerId = scanner.next();

        Customer customer = findCustomer(customerId);

        if (customer == null) {

            System.out.println(
                    "Customer not found."
            );

            return;
        }

        String orderId =
                String.format("O%03d", orderCounter++);

        String date =
                java.time.LocalDate.now().toString();

        Order order =
                new Order(
                        orderId,
                        customer,
                        date
                );


        while (true) {

            viewProducts();

            System.out.print(
                    "\nEnter Product ID (0 to finish): "
            );

            String productId = scanner.next();

            if (productId.equals("0")) {
                break;
            }

            Product product =
                    findProduct(productId);

            if (product == null) {

                System.out.println(
                        "Product not found."
                );

                continue;
            }

            int quantity =
                    getInt("Enter quantity: ");

            if (quantity <= 0) {

                System.out.println(
                        "Quantity must be greater than 0."
                );

                continue;
            }

            order.addProduct(product, quantity);

            System.out.println(
                    "Product added to order!"
            );
        }


        if (order.calculateTotal() == 0) {

            System.out.println(
                    "No products were added."
            );

            return;
        }

        orders.add(order);

        System.out.println(
                "\nOrder placed successfully!"
        );

        order.displayOrder();
    }


    // =========================
    // VIEW ORDERS
    // =========================
    static void viewOrders() {

        if (orders.isEmpty()) {

            System.out.println(
                    "\nNo orders found."
            );

            return;
        }

        System.out.println("\n========== ALL ORDERS ==========");

        for (Order order : orders) {
            order.displayOrder();
        }
    }


    // =========================
    // MAKE PAYMENT
    // =========================
    static void makePayment() {

        if (orders.isEmpty()) {

            System.out.println(
                    "\nNo orders available."
            );

            return;
        }

        System.out.print(
                "\nEnter Order ID: "
        );

        String orderId = scanner.next();

        Order order = findOrder(orderId);

        if (order == null) {

            System.out.println(
                    "Order not found."
            );

            return;
        }

        double amount =
                order.calculateTotal();

        System.out.println("\nPayment Amount: ₹" + amount);

        System.out.println("\nSelect Payment Method:");
        System.out.println("1. Cash");
        System.out.println("2. UPI");
        System.out.println("3. Card");

        int choice =
                getInt("Enter choice: ");

        String paymentId =
                String.format(
                        "PAY%03d",
                        paymentCounter++
                );

        Payment payment;

        switch (choice) {

            case 1:
                payment =
                        new CashPayment(
                                paymentId,
                                amount
                        );
                break;

            case 2:
                payment =
                        new UpiPayment(
                                paymentId,
                                amount
                        );
                break;

            case 3:
                payment =
                        new CardPayment(
                                paymentId,
                                amount
                        );
                break;

            default:
                System.out.println(
                        "Invalid payment method."
                );
                return;
        }

        payment.processPayment();

        order.setPayment(payment);

        System.out.println(
                "\nPayment completed successfully!"
        );
    }


    // =========================
    // FIND CUSTOMER
    // =========================
    static Customer findCustomer(String id) {

        for (Customer customer : customers) {

            if (customer.getCustomerId().equalsIgnoreCase(id)) {
                return customer;
            }
        }

        return null;
    }


    // =========================
    // FIND PRODUCT
    // =========================
    static Product findProduct(String id) {

        for (Product product : products) {

            if (product.getProductId().equalsIgnoreCase(id)) {
                return product;
            }
        }

        return null;
    }


    // =========================
    // FIND ORDER
    // =========================
    static Order findOrder(String id) {

        for (Order order : orders) {

            if (order.getOrderId().equalsIgnoreCase(id)) {
                return order;
            }
        }

        return null;
    }


    // =========================
    // INTEGER INPUT
    // =========================
    static int getInt(String message) {

        while (true) {

            try {

                System.out.print(message);

                return scanner.nextInt();

            } catch (Exception e) {

                System.out.println(
                        "Please enter a valid number."
                );

                scanner.nextLine();
            }
        }
    }
}