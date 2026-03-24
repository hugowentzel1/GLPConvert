# 🚀 **CMS Integration Guide - White-Label Solar Tool**

## 📋 **Quick Start (1-Line Script)**

### **Basic Embed (Any Website)**

```html
<script src="https://sunspire-web-app.vercel.app/embed.js"></script>
```

### **With Company Branding**

```html
<!-- Add these meta tags to your <head> section -->
<meta name="sunspire-company" content="Your Company Name" />
<meta name="sunspire-primary" content="#16A34A" />
<meta name="sunspire-logo" content="https://your-logo-url.com/logo.png" />

<!-- Then add the embed script -->
<script src="https://sunspire-web-app.vercel.app/embed.js"></script>
```

## 🎯 **CMS-Specific Instructions**

### **WordPress**

1. **Go to Appearance → Theme Editor**
2. **Edit header.php** (or use your theme's customizer)
3. **Add before `</head>`:**

```html
<meta name="sunspire-company" content="<?php echo get_bloginfo('name'); ?>" />
<meta name="sunspire-primary" content="#16A34A" />
<script src="https://sunspire-web-app.vercel.app/embed.js"></script>
```

**Alternative: Use a plugin like "Header and Footer Scripts"**

### **Shopify**

1. **Go to Online Store → Themes → Actions → Edit code**
2. **Edit theme.liquid**
3. **Add before `</head>`:**

```html
<meta name="sunspire-company" content="{{ shop.name }}" />
<meta name="sunspire-primary" content="#16A34A" />
<script src="https://sunspire-web-app.vercel.app/embed.js"></script>
```

### **Wix**

1. **Go to Settings → Custom Code**
2. **Add to `<head>` section:**

```html
<meta name="sunspire-company" content="Your Company" />
<meta name="sunspire-primary" content="#16A34A" />
<script src="https://sunspire-web-app.vercel.app/embed.js"></script>
```

### **Squarespace**

1. **Go to Settings → Advanced → Code Injection**
2. **Add to Header:**

```html
<meta name="sunspire-company" content="Your Company" />
<meta name="sunspire-primary" content="#16A34A" />
<script src="https://sunspire-web-app.vercel.app/embed.js"></script>
```

### **Webflow**

1. **Go to Project Settings → Custom Code**
2. **Add to `<head>` section:**

```html
<meta name="sunspire-company" content="Your Company" />
<meta name="sunspire-primary" content="#16A34A" />
<script src="https://sunspire-web-app.vercel.app/embed.js"></script>
```

## 🎨 **Customization Options**

### **Company Branding**

```html
<meta name="sunspire-company" content="GreenFuture Solar" />
<meta name="sunspire-primary" content="#16A34A" />
<meta name="sunspire-logo" content="https://greenfuture.com/logo.png" />
```

### **Button Text (Optional)**

```html
<script>
  window.sunspireConfig = {
    buttonText: "Get Free Solar Quote",
    buttonColor: "#16A34A",
    position: "bottom-right", // bottom-left, top-right, top-left
  };
</script>
```

## 🔧 **Advanced Integration**

### **Custom Button Placement**

```html
<!-- Place this where you want the button -->
<div id="sunspire-custom-cta"></div>

<script>
  // Custom placement
  document.addEventListener("DOMContentLoaded", function () {
    const customCTA = document.getElementById("sunspire-custom-cta");
    if (customCTA) {
      customCTA.innerHTML = `
      <button onclick="openSunspireTool()" style="background: #16A34A; color: white; padding: 12px 24px; border: none; border-radius: 8px;">
        Get Solar Quote
      </button>
    `;
    }
  });
</script>
```

### **Form Integration**

```html
<!-- Add to your contact form -->
<script>
  document
    .getElementById("solar-interest")
    .addEventListener("change", function () {
      if (this.checked) {
        // Show solar tool when user checks "Interested in Solar"
        openSunspireTool();
      }
    });
</script>
```

## 📱 **Mobile Optimization**

The embed script automatically:

- ✅ **Responsive design** for all screen sizes
- ✅ **Touch-friendly** button interactions
- ✅ **Mobile-optimized** solar tool interface
- ✅ **Fast loading** on all devices

## 🚀 **Performance Benefits**

- **Lightweight**: Only 5KB embed script
- **Non-blocking**: Loads asynchronously
- **CDN hosted**: Global fast delivery
- **Cached**: Optimized for repeat visits

## 🎯 **What Happens After Embed**

1. **Floating CTA button** appears on your site
2. **Click opens solar tool** in new window/tab
3. **Fully branded** with your company colors
4. **Collects leads** directly to your system
5. **Professional appearance** boosts conversions

## 📞 **Support & Customization**

Need help with integration? Contact us:

- **Email**: support@sunspire.app
- **Docs**: https://docs.sunspire.app
- **Live Chat**: Available on our website

---

**Ready to boost your solar leads? Embed in 5 minutes!** ⚡
