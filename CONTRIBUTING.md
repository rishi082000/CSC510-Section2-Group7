
# Contributing to PackEats

Thank you for your interest in contributing to **PackEats** 🎉  
PackEats is a secure and efficient campus food delivery platform built for the NC State community.  
We welcome contributions from students, open-source enthusiasts, and developers who want to help us improve code quality, scalability, and user experience.

---

## 🧭 Table of Contents
1. [Project Overview](#project-overview)
2. [Code of Conduct](#code-of-conduct)
3. [Development Setup](#development-setup)
4. [Coding Standards](#coding-standards)
5. [Frontend Guidelines](#frontend-guidelines)
6. [Backend Guidelines](#backend-guidelines)
7. [Testing Standards](#testing-standards)
8. [Commit & Pull Request Process](#commit--pull-request-process)
9. [Extending the System](#extending-the-system)
10. [Common Pitfalls](#common-pitfalls)
11. [Contact](#contact)

---

## 📦 Project Overview

PackEats consists of two main modules:

| Module | Path | Stack | Description |
|---------|------|--------|--------------|
| **Frontend** | `proj2/frontend/pack-eats` | React (JavaScript) | User interface for browsing menus, placing orders, tracking delivery |
| **Backend** | `proj2/backend/pack-eats` | Spring Boot (Java) | APIs for user, vendor, and order management |

Both parts can run independently in development mode.

---

## 🤝 Code of Conduct

By contributing, you agree to:
- Treat all contributors respectfully.
- Maintain clean commit messages and avoid profanity.
- Not introduce any malicious, discriminatory, or plagiarized code.

---

## 🧰 Development Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/rishi082000/CSC510-Section2-Group7.git
   cd CSC510-Section2-Group7

## ✍️ Writing Standards

To maintain a consistent and high-quality codebase and documentation, contributors are expected to follow the writing and commenting standards below.

---

### 🧾 1. Code Comments

- **Write meaningful comments** that explain *why* something is done, not just *what* is done.  
- Avoid obvious comments — prefer self-explanatory code.
- Use **Javadoc-style** comments for Java and **JSDoc-style** comments for JavaScript/React files.

**Example (Java):**
```java
/**
 * Calculates total price of all items in a user's cart.
 * @param cartItems list of cart items
 * @return total price after applying discounts
 */
public double calculateTotal(List<Item> cartItems) {
    ...
}
