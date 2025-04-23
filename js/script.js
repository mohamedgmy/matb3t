// انتظار تحميل المستند بالكامل
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة مكتبة AOS للتأثيرات الحركية
    AOS.init({
        duration: 800,
        easing: 'ease',
        once: true,
        offset: 100
    });

    // تبديل الصور في بطاقات المنتجات مع إضافة التغيير التلقائي
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const slider = card.querySelector('.image-slider');
        const images = slider.querySelectorAll('img');
        
        // إضافة مؤشرات نقطية للصور إذا لم تكن موجودة
        if (!card.querySelector('.slider-indicators')) {
            const indicatorsContainer = document.createElement('div');
            indicatorsContainer.className = 'slider-indicators';
            
            images.forEach((_, index) => {
                const indicator = document.createElement('span');
                indicator.className = index === 0 ? 'indicator active' : 'indicator';
                indicator.dataset.index = index;
                indicator.addEventListener('click', function() {
                    changeImage(parseInt(this.dataset.index));
                });
                indicatorsContainer.appendChild(indicator);
            });
            
            slider.appendChild(indicatorsContainer);
        }
        
        let currentIndex = 0;
        let intervalId;
        
        // وظيفة تغيير الصورة
        const changeImage = (newIndex) => {
            images[currentIndex].classList.remove('active');
            const indicators = card.querySelectorAll('.indicator');
            if (indicators.length > 0) {
                indicators[currentIndex].classList.remove('active');
            }
            
            currentIndex = newIndex;
            
            images[currentIndex].classList.add('active');
            if (indicators.length > 0) {
                indicators[currentIndex].classList.add('active');
            }
        };
        
        // بدء التغيير التلقائي
        const startAutoSlide = () => {
            // إيقاف أي مؤقت سابق
            if (intervalId) {
                clearInterval(intervalId);
            }
            
            // بدء مؤقت جديد
            intervalId = setInterval(() => {
                const nextIndex = (currentIndex + 1) % images.length;
                changeImage(nextIndex);
            }, 3000); // تغيير كل 3 ثوانٍ
        };
        
        // إضافة دعم للأجهزة اللمسية
        let startX, endX;
        
        slider.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
        });
        
        slider.addEventListener('touchend', function(e) {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) { // الحد الأدنى للمسافة للاعتبار كسحب
                if (diff > 0) {
                    // سحب لليسار - الصورة التالية
                    const nextIndex = (currentIndex + 1) % images.length;
                    changeImage(nextIndex);
                } else {
                    // سحب لليمين - الصورة السابقة
                    const prevIndex = (currentIndex - 1 + images.length) % images.length;
                    changeImage(prevIndex);
                }
            }
        });
        
        // بدء التغيير التلقائي عند تحميل الصفحة
        startAutoSlide();
    });

    // تفعيل أزرار الفئات
    const categoryButtons = document.querySelectorAll('.category-button');
    const productCategories = document.querySelectorAll('.product-category');
    
    categoryButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            // إزالة الفئة النشطة من جميع الأزرار
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // إضافة الفئة النشطة للزر المضغوط
            this.classList.add('active');
            
            // إذا كان الزر الأول (الكل)، أظهر جميع الفئات
            if (index === 0) {
                productCategories.forEach(category => {
                    category.style.display = 'block';
                });
            } else {
                // إخفاء جميع الفئات
                productCategories.forEach(category => {
                    category.style.display = 'none';
                });
                // إظهار الفئة المحددة فقط
                if (productCategories[index - 1]) {
                    productCategories[index - 1].style.display = 'block';
                }
            }
        });
    });

    // تأثير التمرير السلس للروابط
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // تأثير تثبيت الهيدر عند التمرير
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.padding = '10px 0';
        } else {
            header.style.padding = '15px 0';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // إضافة تأثير نقر للأزرار
    const allButtons = document.querySelectorAll('.btn, button, .product-nav-button, .category-button');
    allButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.add('btn-clicked');
            setTimeout(() => {
                this.classList.remove('btn-clicked');
            }, 300);
        });
    });
    
    // إضافة تأثير ظهور تدريجي للعناصر عند التمرير
    const fadeElements = document.querySelectorAll('.product-card, .stat-item, .gallery-item, .contact-item');
    
    const fadeInOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px"
    };
    
    const fadeInObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
        });
    }, fadeInOptions);
    
    fadeElements.forEach(element => {
        element.style.opacity = "0";
        element.style.transform = "translateY(20px)";
        element.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        fadeInObserver.observe(element);
    });
});
