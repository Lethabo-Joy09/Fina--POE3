// ========================
// PRODUCTS DATABASE
// ========================
const products = [
  // T-Shirts
  { id: 1, name: 'Classic Black Tee', category: 'tshirt', price: 350, image: './assets/T-Shirt.jpg', description: 'Premium cotton blend with signature logo' },
  { id: 2, name: 'White Street Tee', category: 'tshirt', price: 350, image: './assets/white tee.jpg', description: 'Clean design for everyday wear' },
  { id: 3, name: 'Pink Cotton Tee', category: 'tshirt', price: 350, image: './assets/pink tee.jpg', description: 'Vibrant color with comfortable fit' },
  { id: 4, name: 'Black Logo Tee', category: 'tshirt', price: 350, image: './assets/T-Shirt.jpg', description: 'Bold branding on premium fabric' },
  
  // Hoodies
  { id: 5, name: 'Pink Hoodie', category: 'hoodie', price: 650, image: './assets/pinkhoodie.jpg', description: 'Soft fleece interior for maximum comfort' },
  { id: 6, name: 'Grey Hoodie', category: 'hoodie', price: 650, image: './assets/grey hoodie.jpg', description: 'Perfect for casual street style' },
  { id: 7, name: 'White Hoodie', category: 'hoodie', price: 650, image: './assets/whitw hoodie.jpg', description: 'Clean look with adjustable drawstrings' },
  { id: 8, name: 'Black Oversized Hoodie', category: 'hoodie', price: 650, image: './assets/Hoodie.jpg', description: 'Relaxed fit for ultimate comfort' },
  
  // Tracksuits
  { id: 9, name: 'Black Tracksuit', category: 'tracksuit', price: 850, image: './assets/black track.jpg', description: 'Complete set for athletic and casual wear' },
  { id: 10, name: 'Grey Tracksuit', category: 'tracksuit', price: 850, image: './assets/grey track.jpg', description: 'Matching top and bottom set' },
  { id: 11, name: 'White Tracksuit', category: 'tracksuit', price: 850, image: './assets/white track.jpg', description: 'Premium fabric with stylish design' },
  { id: 12, name: 'Green Tracksuit', category: 'tracksuit', price: 850, image: './assets/green track.jpg', description: 'Unique color for standout style' }
];

// ========================
// SHOPPING CART
// ========================
let cart = [];
let currentSearchQuery = '';

// Load cart from localStorage on page load
function loadCart() {
  try {
    var savedCart = localStorage.getItem('cottonKillaCart');
    if (savedCart) {
      cart = JSON.parse(savedCart);
    }
  } catch (e) {
    console.log('Error loading cart:', e);
    cart = [];
  }
}

// Save cart to localStorage
function saveCart() {
  try {
    localStorage.setItem('cottonKillaCart', JSON.stringify(cart));
  } catch (e) {
    console.log('Error saving cart:', e);
  }
}

// ========================
// DATE & TIME DISPLAY
// ========================
function updateDateTime() {
  var datetimeElement = document.getElementById('datetime');
  if (datetimeElement) {
    var now = new Date();
    var options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    datetimeElement.textContent = now.toLocaleDateString('en-ZA', options);
  }
}

// ========================
// UPDATE CART COUNT
// ========================
function updateCartCount() {
  var cartCount = document.getElementById('cartCount');
  if (cartCount) {
    var totalItems = 0;
    for (var i = 0; i < cart.length; i++) {
      totalItems += cart[i].quantity;
    }
    cartCount.textContent = totalItems;
  }
}

// ========================
// SEARCH FUNCTIONALITY
// ========================
function setupSearch() {
  var searchInput = document.getElementById('searchInput');
  var searchBtn = document.getElementById('searchBtn');
  var clearSearchBtn = document.getElementById('clearSearch');
  
  if (searchInput) {
    // Search on button click
    if (searchBtn) {
      searchBtn.addEventListener('click', function() {
        performSearch();
      });
    }
    
    // Search on Enter key
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
    
    // Clear search
    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', function() {
        searchInput.value = '';
        currentSearchQuery = '';
        clearSearchBtn.style.display = 'none';
        renderProducts();
        hideSearchResults();
      });
    }
  }
}

function performSearch() {
  var searchInput = document.getElementById('searchInput');
  var clearSearchBtn = document.getElementById('clearSearch');
  
  if (!searchInput) return;
  
  var query = searchInput.value.trim().toLowerCase();
  currentSearchQuery = query;
  
  if (query === '') {
    showNotification('Please enter a search term', 'error');
    return;
  }
  
  // Show clear button
  if (clearSearchBtn) {
    clearSearchBtn.style.display = 'inline-block';
  }
  
  // Filter products
  var results = [];
  for (var i = 0; i < products.length; i++) {
    var product = products[i];
    var nameMatch = product.name.toLowerCase().indexOf(query) !== -1;
    var descMatch = product.description.toLowerCase().indexOf(query) !== -1;
    var categoryMatch = product.category.toLowerCase().indexOf(query) !== -1;
    
    if (nameMatch || descMatch || categoryMatch) {
      results.push(product);
    }
  }
  
  displaySearchResults(results, query);
}

function displaySearchResults(results, query) {
  var searchResultsSection = document.getElementById('searchResults');
  var searchResultsGrid = document.getElementById('searchResultsGrid');
  var searchResultsCount = document.getElementById('searchResultsCount');
  
  if (!searchResultsSection || !searchResultsGrid) {
    // If search results section doesn't exist, create it
    createSearchResultsSection();
    searchResultsSection = document.getElementById('searchResults');
    searchResultsGrid = document.getElementById('searchResultsGrid');
    searchResultsCount = document.getElementById('searchResultsCount');
  }
  
  // Show search results section
  searchResultsSection.style.display = 'block';
  
  // Hide other sections
  var allSections = document.querySelectorAll('.product-category');
  for (var i = 0; i < allSections.length; i++) {
    allSections[i].style.display = 'none';
  }
  
  // Update count
  if (searchResultsCount) {
    searchResultsCount.textContent = results.length + ' result' + (results.length !== 1 ? 's' : '') + ' for "' + query + '"';
  }
  
  // Display results
  if (results.length === 0) {
    searchResultsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;"><h3>No products found</h3><p>Try searching for something else like "hoodie", "black", or "tracksuit"</p></div>';
  } else {
    var html = '';
    for (var i = 0; i < results.length; i++) {
      html += createProductCard(results[i]);
    }
    searchResultsGrid.innerHTML = html;
  }
  
  // Scroll to results
  searchResultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hideSearchResults() {
  var searchResultsSection = document.getElementById('searchResults');
  if (searchResultsSection) {
    searchResultsSection.style.display = 'none';
  }
  
  // Show other sections
  var allSections = document.querySelectorAll('.product-category');
  for (var i = 0; i < allSections.length; i++) {
    allSections[i].style.display = 'block';
  }
}

function createSearchResultsSection() {
  var productsMain = document.querySelector('main');
  if (!productsMain) return;
  
  var categoryNav = document.querySelector('.category-nav');
  
  var searchSection = document.createElement('section');
  searchSection.id = 'searchResults';
  searchSection.className = 'product-category';
  searchSection.style.display = 'none';
  searchSection.innerHTML = '<h2 id="searchResultsCount">Search Results</h2><div class="product-grid" id="searchResultsGrid"></div>';
  
  if (categoryNav && categoryNav.nextSibling) {
    productsMain.insertBefore(searchSection, categoryNav.nextSibling);
  } else {
    productsMain.appendChild(searchSection);
  }
}

// ========================
// RENDER PRODUCTS
// ========================
function renderProducts() {
  // Featured products (homepage)
  var featuredContainer = document.getElementById('featuredProducts');
  if (featuredContainer) {
    var featured = [products[0], products[4], products[8]];
    var html = '';
    for (var i = 0; i < featured.length; i++) {
      html += createProductCard(featured[i]);
    }
    featuredContainer.innerHTML = html;
  }

  // Products page - All Products section
  var allTshirts = document.getElementById('allTshirts');
  if (allTshirts) {
    var tshirts = [];
    for (var i = 0; i < products.length; i++) {
      if (products[i].category === 'tshirt') {
        tshirts.push(products[i]);
      }
    }
    var html = '';
    for (var i = 0; i < Math.min(2, tshirts.length); i++) {
      html += createProductCard(tshirts[i]);
    }
    allTshirts.innerHTML = html;
  }

  var allHoodies = document.getElementById('allHoodies');
  if (allHoodies) {
    var hoodies = [];
    for (var i = 0; i < products.length; i++) {
      if (products[i].category === 'hoodie') {
        hoodies.push(products[i]);
      }
    }
    var html = '';
    for (var i = 0; i < Math.min(2, hoodies.length); i++) {
      html += createProductCard(hoodies[i]);
    }
    allHoodies.innerHTML = html;
  }

  var allTracksuits = document.getElementById('allTracksuits');
  if (allTracksuits) {
    var tracksuits = [];
    for (var i = 0; i < products.length; i++) {
      if (products[i].category === 'tracksuit') {
        tracksuits.push(products[i]);
      }
    }
    var html = '';
    for (var i = 0; i < Math.min(2, tracksuits.length); i++) {
      html += createProductCard(tracksuits[i]);
    }
    allTracksuits.innerHTML = html;
  }

  // Products page - Individual category sections
  var tshirtsGrid = document.getElementById('tshirtsGrid');
  if (tshirtsGrid) {
    var tshirts = [];
    for (var i = 0; i < products.length; i++) {
      if (products[i].category === 'tshirt') {
        tshirts.push(products[i]);
      }
    }
    var html = '';
    for (var i = 0; i < tshirts.length; i++) {
      html += createProductCard(tshirts[i]);
    }
    tshirtsGrid.innerHTML = html;
  }

  var hoodiesGrid = document.getElementById('hoodiesGrid');
  if (hoodiesGrid) {
    var hoodies = [];
    for (var i = 0; i < products.length; i++) {
      if (products[i].category === 'hoodie') {
        hoodies.push(products[i]);
      }
    }
    var html = '';
    for (var i = 0; i < hoodies.length; i++) {
      html += createProductCard(hoodies[i]);
    }
    hoodiesGrid.innerHTML = html;
  }

  var tracksuitsGrid = document.getElementById('tracksuitsGrid');
  if (tracksuitsGrid) {
    var tracksuits = [];
    for (var i = 0; i < products.length; i++) {
      if (products[i].category === 'tracksuit') {
        tracksuits.push(products[i]);
      }
    }
    var html = '';
    for (var i = 0; i < tracksuits.length; i++) {
      html += createProductCard(tracksuits[i]);
    }
    tracksuitsGrid.innerHTML = html;
  }
}

// ========================
// CREATE PRODUCT CARD
// ========================
function createProductCard(product) {
  return '<div class="product-card">' +
    '<img src="' + product.image + '" alt="' + product.name + '" class="lightbox-trigger" onclick="openLightbox(\'' + product.image + '\')">' +
    '<h3>' + product.name + '</h3>' +
    '<p>' + product.description + '</p>' +
    '<span class="price">R' + product.price + '</span>' +
    '<div class="size-selector" data-product-id="' + product.id + '">' +
      '<button class="size-btn" data-size="S">S</button>' +
      '<button class="size-btn" data-size="M">M</button>' +
      '<button class="size-btn" data-size="L">L</button>' +
    '</div>' +
    '<div class="product-actions">' +
      '<button class="add-to-cart-btn" onclick="addToCart(' + product.id + ')" data-product-id="' + product.id + '" disabled>' +
        '<i class="fas fa-shopping-cart"></i> Add to Cart' +
      '</button>' +
    '</div>' +
  '</div>';
}

// ========================
// SIZE SELECTION
// ========================
function setupSizeSelection() {
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('size-btn')) {
      var sizeSelector = e.target.parentElement;
      var productId = sizeSelector.getAttribute('data-product-id');
      var sizeButtons = sizeSelector.querySelectorAll('.size-btn');
      
      // Remove selected class from all size buttons
      for (var i = 0; i < sizeButtons.length; i++) {
        sizeButtons[i].classList.remove('selected');
      }
      
      // Add selected class to clicked button
      e.target.classList.add('selected');
      
      // Enable add to cart button
      var addToCartBtn = document.querySelector('.add-to-cart-btn[data-product-id="' + productId + '"]');
      if (addToCartBtn) {
        addToCartBtn.disabled = false;
        addToCartBtn.setAttribute('data-selected-size', e.target.getAttribute('data-size'));
      }
    }
  });
}

// ========================
// ADD TO CART
// ========================
function addToCart(productId) {
  var product = null;
  for (var i = 0; i < products.length; i++) {
    if (products[i].id === productId) {
      product = products[i];
      break;
    }
  }
  
  if (!product) return;
  
  var addToCartBtn = document.querySelector('.add-to-cart-btn[data-product-id="' + productId + '"]');
  var selectedSize = addToCartBtn ? addToCartBtn.getAttribute('data-selected-size') : null;
  
  if (!selectedSize) {
    showNotification('Please select a size first!', 'error');
    return;
  }
  
  // Check if item with same size already exists
  var existingItem = null;
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === productId && cart[i].size === selectedSize) {
      existingItem = cart[i];
      break;
    }
  }
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      quantity: 1
    });
  }
  
  saveCart();
  updateCartCount();
  showNotification(product.name + ' (Size ' + selectedSize + ') added to cart!', 'success');
  
  // Reset size selection
  var sizeSelector = document.querySelector('.size-selector[data-product-id="' + productId + '"]');
  if (sizeSelector) {
    var sizeButtons = sizeSelector.querySelectorAll('.size-btn');
    for (var i = 0; i < sizeButtons.length; i++) {
      sizeButtons[i].classList.remove('selected');
    }
  }
  if (addToCartBtn) {
    addToCartBtn.disabled = true;
    addToCartBtn.removeAttribute('data-selected-size');
  }
}

// ========================
// SHOW/HIDE CART MODAL
// ========================
function setupCartModal() {
  var cartIcon = document.getElementById('cartIcon');
  var cartModal = document.getElementById('cartModal');
  var cartClose = document.getElementById('cartClose');

  if (cartIcon) {
    cartIcon.addEventListener('click', function() {
      cartModal.classList.add('active');
      renderCart();
    });
  }

  if (cartClose) {
    cartClose.addEventListener('click', function() {
      cartModal.classList.remove('active');
    });
  }

  if (cartModal) {
    cartModal.addEventListener('click', function(e) {
      if (e.target === cartModal) {
        cartModal.classList.remove('active');
      }
    });
  }
}

// ========================
// RENDER CART
// ========================
function renderCart() {
  var cartItemsContainer = document.getElementById('cartItemsContainer');
  var cartTotal = document.getElementById('cartTotal');
  var cartTotalAmount = document.getElementById('cartTotalAmount');
  
  if (!cartItemsContainer) return;
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p style="text-align: center; padding: 40px; color: #999;">Your cart is empty</p>';
    if (cartTotal) cartTotal.style.display = 'none';
    return;
  }
  
  var total = 0;
  var html = '';
  
  for (var i = 0; i < cart.length; i++) {
    var item = cart[i];
    total += item.price * item.quantity;
    html += '<div class="cart-item">' +
      '<img src="' + item.image + '" alt="' + item.name + '">' +
      '<div class="cart-item-details">' +
        '<h4>' + item.name + '</h4>' +
        '<p>Size: ' + item.size + '</p>' +
        '<p>Quantity: ' + item.quantity + '</p>' +
        '<p><strong>R' + (item.price * item.quantity) + '</strong></p>' +
      '</div>' +
      '<span class="cart-item-remove" onclick="removeFromCart(' + i + ')">' +
        '<i class="fas fa-trash"></i>' +
      '</span>' +
    '</div>';
  }
  
  cartItemsContainer.innerHTML = html;
  
  if (cartTotal) cartTotal.style.display = 'block';
  if (cartTotalAmount) cartTotalAmount.textContent = 'R' + total;
}

// ========================
// REMOVE FROM CART
// ========================
function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartCount();
  renderCart();
  showNotification('Item removed from cart', 'info');
}

// ========================
// CHECKOUT
// ========================
function setupCheckout() {
  var checkoutBtn = document.getElementById('checkoutBtn');
  var checkoutModal = document.getElementById('checkoutModal');
  var checkoutForm = document.getElementById('checkoutForm');

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
      if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
      }
      
      var cartModal = document.getElementById('cartModal');
      if (cartModal) cartModal.classList.remove('active');
      if (checkoutModal) checkoutModal.classList.add('active');
      renderCheckoutSummary();
    });
  }

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      var name = document.getElementById('checkout-name').value;
      var email = document.getElementById('checkout-email').value;
      var totalElement = document.getElementById('checkoutTotal');
      var total = totalElement ? totalElement.textContent : 'R0';
      
      showNotification('Processing payment...', 'info');
      
      setTimeout(function() {
        cart = [];
        saveCart();
        updateCartCount();
        
        if (checkoutModal) checkoutModal.classList.remove('active');
        
        showNotification('Payment successful! Order confirmation sent to ' + email + '. Total: ' + total, 'success');
        
        checkoutForm.reset();
      }, 2000);
    });
  }
}

function closeCheckout() {
  var checkoutModal = document.getElementById('checkoutModal');
  if (checkoutModal) {
    checkoutModal.classList.remove('active');
  }
}

function renderCheckoutSummary() {
  var checkoutSummary = document.getElementById('checkoutSummary');
  var checkoutTotal = document.getElementById('checkoutTotal');
  
  if (!checkoutSummary) return;
  
  var total = 0;
  var html = '';
  
  for (var i = 0; i < cart.length; i++) {
    var item = cart[i];
    total += item.price * item.quantity;
    html += '<p>' + item.name + ' (' + item.size + ') x ' + item.quantity + ' - R' + (item.price * item.quantity) + '</p>';
  }
  
  checkoutSummary.innerHTML = html;
  if (checkoutTotal) checkoutTotal.textContent = 'R' + total;
}

// ========================
// LIGHTBOX
// ========================
function setupLightbox() {
  var lightbox = document.getElementById('lightbox');
  var lightboxClose = document.getElementById('lightboxClose');

  if (lightboxClose) {
    lightboxClose.addEventListener('click', function() {
      if (lightbox) lightbox.classList.remove('active');
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
      }
    });
  }

  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('lightbox-trigger')) {
      openLightbox(e.target.src);
    }
  });
}

function openLightbox(imageSrc) {
  var lightbox = document.getElementById('lightbox');
  var lightboxImage = document.getElementById('lightboxImage');
  
  if (lightbox && lightboxImage) {
    lightboxImage.src = imageSrc;
    lightbox.classList.add('active');
  }
}

// ========================
// NOTIFICATION SYSTEM
// ========================
function showNotification(message, type) {
  var notification = document.getElementById('notification');
  if (!notification) return;
  
  notification.textContent = message;
  notification.className = 'notification ' + type + ' active';
  
  setTimeout(function() {
    notification.classList.remove('active');
  }, 4000);
}

// ========================
// CONTACT FORM
// ========================
function setupContactForm() {
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      var name = document.getElementById('contact-name').value;
      var email = document.getElementById('contact-email').value;
      var subject = document.getElementById('contact-subject').value;
      var message = document.getElementById('contact-message').value;
      
      showNotification('Sending message...', 'info');
      
      setTimeout(function() {
        console.log('Contact Form Data:', { name: name, email: email, subject: subject, message: message });
        
        showNotification('Thank you ' + name + '! Your message has been sent. We will respond to ' + email + ' within 24 hours.', 'success');
        contactForm.reset();
      }, 1500);
    });
  }
}

// ========================
// ENQUIRY FORM
// ========================
function setupEnquiryForm() {
  var enquiryForm = document.getElementById('enquiryForm');
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      var name = document.getElementById('name').value;
      var email = document.getElementById('email').value;
      var phone = document.getElementById('phone').value;
      var enquiryType = document.getElementById('enquiry-type').value;
      var productInterest = document.getElementById('product-interest').value;
      var quantity = document.getElementById('quantity').value;
      var message = document.getElementById('message').value;
      var newsletter = document.getElementById('newsletter').checked;
      
      showNotification('Sending enquiry...', 'info');
      
      setTimeout(function() {
        console.log('Enquiry Form Data:', { 
          name: name, 
          email: email, 
          phone: phone, 
          enquiryType: enquiryType, 
          productInterest: productInterest, 
          quantity: quantity, 
          message: message, 
          newsletter: newsletter 
        });
        
        var responseMsg = 'Thank you ' + name + '! Your enquiry has been received. ';
        
        if (newsletter) {
          responseMsg += 'You have been subscribed to our newsletter. ';
        }
        
        responseMsg += 'We will contact you at ' + email + ' within 24 hours.';
        
        showNotification(responseMsg, 'success');
        enquiryForm.reset();
      }, 1500);
    });
  }
}

// ========================
// FAQ ACCORDION
// ========================
function setupFAQ() {
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('faq-question') || e.target.parentElement.classList.contains('faq-question')) {
      var faqItem = e.target.closest('.faq-item');
      if (!faqItem) return;
      
      var isActive = faqItem.classList.contains('active');
      
      var allFaqItems = document.querySelectorAll('.faq-item');
      for (var i = 0; i < allFaqItems.length; i++) {
        allFaqItems[i].classList.remove('active');
      }
      
      if (!isActive) {
        faqItem.classList.add('active');
      }
    }
  });
}

// ========================
// CATEGORY NAVIGATION
// ========================
function setupCategoryNav() {
  var categoryLinks = document.querySelectorAll('.category-nav-links a');

  for (var i = 0; i < categoryLinks.length; i++) {
    categoryLinks[i].addEventListener('click', function(e) {
      e.preventDefault();
      
      // Clear search
      var searchInput = document.getElementById('searchInput');
      if (searchInput) {
        searchInput.value = '';
        currentSearchQuery = '';
        var clearSearchBtn = document.getElementById('clearSearch');
        if (clearSearchBtn) clearSearchBtn.style.display = 'none';
        hideSearchResults();
      }
      
      var allLinks = document.querySelectorAll('.category-nav-links a');
      for (var j = 0; j < allLinks.length; j++) {
        allLinks[j].classList.remove('category-highlight');
      }
      
      this.classList.add('category-highlight');
      
      var targetId = this.getAttribute('href');
      var targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        var headerOffset = 150;
        var elementPosition = targetSection.getBoundingClientRect().top;
        var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  }
}

// ========================
// KEYBOARD SHORTCUTS
// ========================
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      var lightbox = document.getElementById('lightbox');
      var cartModal = document.getElementById('cartModal');
      var checkoutModal = document.getElementById('checkoutModal');
      
      if (lightbox && lightbox.classList.contains('active')) {
        lightbox.classList.remove('active');
      }
      if (cartModal && cartModal.classList.contains('active')) {
        cartModal.classList.remove('active');
      }
      if (checkoutModal && checkoutModal.classList.contains('active')) {
        checkoutModal.classList.remove('active');
      }
    }
  });
}

// ========================
// INITIALIZE ON PAGE LOAD
// ========================
document.addEventListener('DOMContentLoaded', function() {
  loadCart();
  renderProducts();
  updateCartCount();
  updateDateTime();
  setupSizeSelection();
  setupCartModal();
  setupCheckout();
  setupLightbox();
  setupContactForm();
  setupEnquiryForm();
  setupFAQ();
  setupCategoryNav();
  setupKeyboardShortcuts();
  setupSearch();
  
  // Update time every minute
  setInterval(updateDateTime, 60000);
  
  console.log('Cotton Killa Website Loaded Successfully!');
  console.log('Search feature active!');
});
    