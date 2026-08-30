/* ==========================================================================
   KOMOREBI SANCTUARY • APPLICATION CONTROLLER
   Integrates ThreeUI 3D Engine, Web Audio, GSAP & Interactions
   ========================================================================== */

import { KomorebiScene } from './three-scene.js';
import { ZenAudioEngine } from './audio-engine.js';

// Database of Villas
export const VILLAS_DATA = {
  'glass-pine': {
    id: 'glass-pine',
    name: 'The Glass Pine Pavilion',
    badge: 'Most Popular',
    price: 3850000,
    area: '85m²',
    guests: '2 - 3 Khách',
    view: 'Thung Lũng Mây & Rừng Thông Cổ',
    images: [
      'images/homestay/1mc2t12000szinjjtbc1b-r-800-800-r5.webp',
      'images/homestay/721039566.webp',
      'images/homestay/ava-mau-nha-homestay-dep-800x800.jpg'
    ],
    description: 'Căn nhà kính lọt thỏm giữa cụm thông trăm tuổi, bồn sục onsen gỗ pơ-mu ngoài ban công kính nhìn thẳng xuống thung lũng bồng bềnh mây. Không gian được thiết kế theo phong cách tối giản Wabi-Sabi tôn vinh vẻ đẹp nguyên bản của đá và gỗ tự nhiên.',
    features: [
      'Bồn tắm khoáng nóng Onsen Pơ-mu ngoài trời ngắm mây',
      'Vách kính Low-E tràn viền 3 hướng chống chói và cách âm tuyệt đối',
      'Giường ngủ King-size nệm cao su non bọc vải lanh tự nhiên',
      'Hệ thống sưởi sàn đá bazan ấm áp trong mùa đông sương giá',
      'Lò sưởi củi thông thật và quầy bar trà Shan Tuyết thủ công',
      'Starlink High-Speed WiFi & Loa Bluetooth Bang & Olufsen'
    ]
  },
  'cloud-crest': {
    id: 'cloud-crest',
    name: 'Cloud Crest Loft',
    badge: 'Best Sunrise',
    price: 4200000,
    area: '110m²',
    guests: '2 - 4 Khách',
    view: 'Mỏm Đá Cao Nhất • Đón Bình Minh',
    images: [
      'images/homestay/homestay-quan-1-2.png',
      'images/homestay/homestay-quan-1-8.png'
    ],
    description: 'Tọa lạc tại điểm cao nhất của khuôn viên, căn gác lửng kính sở hữu sân hiên ngắm bình minh triệu đô và trần kính giếng trời ngắm dải ngân hà lấp lánh mỗi đêm.',
    features: [
      'Sân hiên gỗ Teak 40m² vươn ra khoảng không săn mây buổi sớm',
      'Kính thiên văn khúc xạ chuyên nghiệp Celestron ngắm sao',
      'Phòng xông hơi khô Sauna gỗ tuyết tùng Phần Lan riêng biệt',
      'Bồn tắm đá nguyên khối đục thủ công hướng thung lũng',
      'Bữa sáng Floating Breakfast phục vụ tận hồ bơi nước ấm'
    ]
  },
  'mizu-stream': {
    id: 'mizu-stream',
    name: 'Mizu Stream Retreat',
    badge: 'Riverside Calm',
    price: 4650000,
    area: '135m²',
    guests: '4 - 6 Khách (Gia đình)',
    view: 'Bên Bờ Suối Mơ Róc Rách',
    images: [
      'images/homestay/homestay-vinh-hy-2.png',
      'images/homestay/images-1.jpg'
    ],
    description: 'Dinh thự gỗ 2 tầng nép mình dưới rặng tre và bên cạnh dòng suối Mơ trong vắt. Tiếng nước chảy róc rách suốt ngày đêm mang lại cảm giác an yên tuyệt đối cho cả gia đình.',
    features: [
      '2 phòng ngủ Master độc lập có phòng tắm kính riêng',
      'Bếp đảo sang trọng trang bị đầy đủ dụng cụ nấu ăn cao cấp',
      'Trà đình nổi giữa hồ cá Koi và vườn sỏi thiền Nhật Bản',
      'Hồ ngâm khoáng nóng sục khí Jacuzzi duy trì 38°C quanh năm',
      'Phòng sinh hoạt chung với máy chiếu phim 4K 120-inch'
    ]
  },
  'aether-dome': {
    id: 'aether-dome',
    name: 'Aether Star Observatory',
    badge: 'Signature Dome',
    price: 5200000,
    area: '150m²',
    guests: '2 - 4 Khách',
    view: 'Vòm Kính Toàn Cảnh 360°',
    images: [
      'images/homestay/images-2.jpg',
      'images/homestay/images-3.jpg'
    ],
    description: 'Kiệt tác mái vòm kính geodesic chịu lực tọa lạc trên đỉnh đồi lộng gió. Nơi ranh giới giữa nội thất sang trọng và vũ trụ huyền ảo được xóa nhòa hoàn toàn.',
    features: [
      'Hồ bơi vô cực nước ấm sưởi nhiệt tràn viền nhìn ra mây ngàn',
      'Quản gia riêng (Butler) phục vụ trà đạo và ẩm thực 24/7',
      'Hầm rượu vang mini với tuyển chọn vang mộc biodynamic',
      'Nội thất bespoke từ da bò Ý và gỗ óc chó Bắc Mỹ nguyên tấm',
      'Đặc quyền đưa đón xe Limousine sang trọng khứ hồi miễn phí'
    ]
  }
};

class App {
  constructor() {
    this.scene = null;
    this.audio = null;
    this.init();
  }

  init() {
    // 1. Init 3D Three.js Scene
    this.scene = new KomorebiScene('webgl-canvas');

    // 2. Init Procedural Sound Engine
    this.audio = new ZenAudioEngine();

    // 3. Init Lucide Icons
    if (window.lucide) {
      window.lucide.createIcons();
    }

    // 4. Advanced Motion Systems
    this.initLenis();
    this.initPreloader();
    this.initCustomCursor();
    this.initMagneticAttraction();
    this.initMarquee();
    this.initImageTrail();
    this.initMicroAudio();

    // 5. Bind UI Listeners
    this.bindHeaderScroll();
    this.bindMoodSelector();
    this.bindAudioControls();
    this.bindVillaFilters();
    this.bind3DTilt();
    this.bindModalsAndDrawers();
    this.bindTourModal();
    this.bindScrollAnimations();
    this.initLocationMap();
  }

  /* GSAP ScrollTrigger Orchestration */
  bindScrollAnimations() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    const progressBar = document.getElementById('scroll-progress');

    // 1. Global Scroll Progress Bar & Three.js Camera Linking
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const progress = self.progress;
        const velocity = self.getVelocity();

        // Update golden luxury scroll progress bar
        if (progressBar) {
          progressBar.style.width = `${(progress * 100).toFixed(1)}%`;
        }

        // Update 3D WebGL Camera position & fireflies
        if (this.scene) {
          this.scene.setScrollProgress(progress, velocity);
        }
      }
    });

    // 2. Hero Section Parallax Fade-out on Scroll
    gsap.to('.hero-content', {
      y: 90,
      opacity: 0.1,
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom 20%',
        scrub: 1
      }
    });

    gsap.to('#booking-dock', {
      y: 35,
      opacity: 0.85,
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'center top',
        end: 'bottom top',
        scrub: 1
      }
    });

    // 3. Section Badges and Titles Entrance
    gsap.utils.toArray('.section-badge:not(#panorama-section .section-badge)').forEach((badge) => {
      gsap.from(badge, {
        y: 25,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: badge,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      });
    });

    gsap.utils.toArray('.section-title:not(#panorama-section .section-title)').forEach((title) => {
      gsap.from(title, {
        y: 35,
        opacity: 0,
        duration: 1.0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: title,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });

    // 4. Philosophy Cards Stagger
    gsap.from('.philo-card', {
      y: 60,
      opacity: 0,
      stagger: 0.14,
      duration: 1.1,
      ease: 'back.out(1.2)',
      scrollTrigger: {
        trigger: '.philosophy-grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    // 5. Villas Stacking Cards Scroll Scrub (Layered Deck of Cards)
    const stackCards = gsap.utils.toArray('.villa-card.stack-card');
    stackCards.forEach((card, i) => {
      if (i < stackCards.length - 1) {
        const nextCard = stackCards[i + 1];
        gsap.to(card, {
          scale: 0.94 - (i * 0.02),
          opacity: 0.65,
          filter: 'brightness(0.6) blur(0.5px)',
          ease: 'none',
          scrollTrigger: {
            trigger: nextCard,
            start: 'top 85%',
            end: 'top 35%',
            scrub: 0.6,
          }
        });
      }
    });

    // Subtle parallax zoom within villa card image wrapper
    document.querySelectorAll('.villa-card').forEach((card) => {
      const img = card.querySelector('.villa-img');
      if (img) {
        gsap.fromTo(img, 
          { yPercent: -5, scale: 1.02 },
          {
            yPercent: 5,
            scale: 1.07,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2
            }
          }
        );
      }
    });

    // 6. Sensory Sound Box Entrance
    gsap.from('.sensory-box', {
      scale: 0.94,
      y: 50,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.sensory-section',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    // 7. Experiences Grid Cards Stagger
    gsap.from('.exp-card', {
      y: 60,
      opacity: 0,
      stagger: 0.18,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.exp-grid',
        start: 'top 82%',
        toggleActions: 'play none none none'
      }
    });

    // 8. Reviews Cards Stagger
    gsap.from('.review-card', {
      y: 50,
      opacity: 0,
      stagger: 0.15,
      duration: 1.0,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.reviews-slider',
        start: 'top 82%',
        toggleActions: 'play none none none'
      }
    });

    // 9. Premium Asymmetric Scenery Gallery Grid Entrance Animation
    gsap.from('.scenery-card', {
      y: 60,
      opacity: 0,
      stagger: 0.15,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.scenery-grid',
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });

    // 9.5 Location & Map Entrance Animations
    gsap.from('.location-content', {
      x: -50,
      opacity: 0,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.location-section',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    gsap.from('.location-map-card', {
      x: 50,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.location-section',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    // 10. Pre-footer CTA Banner
    gsap.from('.cta-banner-card', {
      scale: 0.93,
      y: 40,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.cta-banner-section',
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  }

  /* 1. Lenis Smooth Inertia Scroll */
  initLenis() {
    if (typeof Lenis === 'undefined') return;
    this.lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    this.lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      this.lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  /* 2. Cinematic Countdown Preloader */
  initPreloader() {
    const preloader = document.getElementById('preloader');
    const counterEl = document.getElementById('preloader-counter');
    const statusEl = document.getElementById('preloader-status');
    const fillEl = document.getElementById('preloader-bar-fill');
    if (!preloader || !counterEl) return;

    const countObj = { val: 0 };
    gsap.to(countObj, {
      val: 100,
      duration: 2.0,
      ease: 'power2.inOut',
      onUpdate: () => {
        const p = Math.round(countObj.val);
        counterEl.textContent = (p < 10 ? '0' + p : p) + '%';
        if (fillEl) fillEl.style.width = p + '%';
        if (statusEl) {
          if (p < 30) statusEl.textContent = 'KHỞI TẠO 3D MIST & KHÔNG GIAN...';
          else if (p < 65) statusEl.textContent = 'ĐỒNG BỘ ÁNH SÁNG & ĐOM ĐÓM HOÀNG HÔN...';
          else if (p < 95) statusEl.textContent = 'HOÀN TẤT THÍNH ÂM THIÊN NHIÊN...';
          else statusEl.textContent = 'CHÀO MỪNG ĐẾN KOMOREBI SANCTUARY';
        }
      },
      onComplete: () => {
        preloader.classList.add('loaded');
        this.animateHeroEntrance();
      }
    });
  }

  /* Kinetic Hero Entrance & Text Scramble */
  animateHeroEntrance() {
    // 1. Text Scramble on Hero Badge Coordinates
    const badgeText = document.querySelector('.badge-text');
    if (badgeText) {
      this.scrambleText(badgeText, "22°20'N 103°50'E • ĐỘ CAO 1,650M TRÊN MỰC NƯỚC BIỂN", 1.5);
    }

    // 2. Staggered Mask Reveal on Hero Title & Subtitle
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.from('.title-sub', {
      y: 40,
      opacity: 0,
      duration: 1.2,
      delay: 0.2
    })
    .from('.title-main', {
      y: 60,
      opacity: 0,
      duration: 1.4
    }, '-=0.9')
    .from('.hero-description', {
      y: 35,
      opacity: 0,
      duration: 1.2
    }, '-=1.0')
    .from('.hero-actions .liquid-btn, .hero-actions .ghost-btn', {
      y: 30,
      opacity: 0,
      stagger: 0.15,
      duration: 1.0
    }, '-=0.8')
    .from('.hero-stats .stat-item', {
      y: 25,
      opacity: 0,
      stagger: 0.12,
      duration: 0.9
    }, '-=0.8')
    .from('#booking-dock', {
      y: 60,
      opacity: 0,
      duration: 1.3,
      ease: 'back.out(1.2)'
    }, '-=0.7');
  }

  /* Alphanumeric Text Scramble Effect */
  scrambleText(element, finalString, duration = 1.5) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789°•/\'';
    const length = finalString.length;
    let iteration = 0;
    const interval = setInterval(() => {
      element.innerText = finalString
        .split('')
        .map((char, index) => {
          if (index < iteration) {
            return finalString[index];
          }
          if (char === ' ') return ' ';
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      if (iteration >= length) {
        clearInterval(interval);
        element.innerText = finalString;
      }
      iteration += 1.5;
    }, 30);
  }

  /* 3. Custom Interactive Magnetic Cursor with Trailing Physics */
  initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    const dot = document.getElementById('cursor-dot');
    const cursorText = document.getElementById('cursor-text');
    if (!cursor || !dot) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    });

    // Smooth trailing physics
    const renderCursor = () => {
      cursorX += (mouseX - cursorX) * 0.18;
      cursorY += (mouseY - cursorY) * 0.18;

      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;

      requestAnimationFrame(renderCursor);
    };
    requestAnimationFrame(renderCursor);

    // Hover contextual labels
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest('[data-cursor]');
      const isBtn = e.target.closest('button, .liquid-btn, .ghost-btn, a, input, select');

      if (target) {
        cursor.classList.add('active-hover');
        cursorText.textContent = target.dataset.cursor || 'XEM';
      } else if (isBtn) {
        cursor.classList.add('button-hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      const target = e.target.closest('[data-cursor]');
      const isBtn = e.target.closest('button, .liquid-btn, .ghost-btn, a, input, select');

      if (target) {
        cursor.classList.remove('active-hover');
        cursorText.textContent = '';
      }
      if (isBtn) {
        cursor.classList.remove('button-hover');
      }
    });
  }

  /* 4. Magnetic Attraction on Buttons (Spring Physics) */
  initMagneticAttraction() {
    const magneticBtns = document.querySelectorAll('.liquid-btn, .ghost-btn, .mood-btn, .sound-toggle-btn');
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(btn, {
          x: x * 0.35,
          y: y * 0.35,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: 'elastic.out(1, 0.4)'
        });
      });
    });
  }

  /* 5. Infinite Kinetic Marquee with Scroll Velocity Boost */
  initMarquee() {
    const track = document.getElementById('marquee-track');
    if (!track) return;

    let x = 0;
    const speed = 1.0;

    const animateMarquee = () => {
      const velocity = ScrollTrigger.isTouch ? 0 : ScrollTrigger.getById('mainScroll')?.getVelocity() || 0;
      const boost = Math.min(Math.abs(velocity) * 0.003, 5.0);
      x -= (speed + boost);

      if (x <= -track.offsetWidth / 2) {
        x = 0;
      }
      track.style.transform = `translateX(${x}px)`;
      requestAnimationFrame(animateMarquee);
    };
    requestAnimationFrame(animateMarquee);
  }

  // 6. Asymmetric Scenery Gallery Grid Section - Animation handle is set up in bindScrollAnimations

  /* 7. Hover Image Trail on Philosophy & Experiences */
  initImageTrail() {
    const trailContainer = document.getElementById('image-trail-container');
    const targetAreas = document.querySelectorAll('.philosophy-section, .experiences-section');
    if (!trailContainer || targetAreas.length === 0) return;

    const trailImages = [
      'images/homestay/mau-nha-homestay-dep-22.jpg',
      'images/an-uong-thu-gian/du-lich-am-thuc-1.jpg',
      'images/vui-choi-giai-tri/dich-vu-vui-choi-giai-tri.jpg',
      'images/van-hoa-trai-nghiem/du-lich-trai-nghiem-6.jpg',
      'images/thien-nhien-kham-pha/images.jpg'
    ];

    let lastX = 0;
    let lastY = 0;
    let imgIdx = 0;

    targetAreas.forEach(area => {
      area.addEventListener('mousemove', (e) => {
        const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
        if (dist > 95) {
          lastX = e.clientX;
          lastY = e.clientY;

          const imgEl = document.createElement('div');
          imgEl.className = 'trail-img';
          imgEl.style.left = `${e.clientX}px`;
          imgEl.style.top = `${e.clientY}px`;
          imgEl.innerHTML = `<img src="${trailImages[imgIdx % trailImages.length]}" alt="Komorebi Trail" />`;
          trailContainer.appendChild(imgEl);
          imgIdx++;

          gsap.fromTo(imgEl, 
            { scale: 0.4, opacity: 0.85, rotation: (Math.random() - 0.5) * 20 },
            {
              scale: 1.0,
              opacity: 0,
              y: -30,
              duration: 1.0,
              ease: 'power2.out',
              onComplete: () => imgEl.remove()
            }
          );
        }
      });
    });
  }

  /* 8. Micro-audio Mechanical Feedback on Interactive Elements */
  initMicroAudio() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('button, .liquid-btn, .ghost-btn, .tab-btn, .track-btn, .mood-btn, select');
      if (btn && this.audio) {
        this.audio.playClick(650);
      }
    });

    document.querySelectorAll('.tab-btn, .mood-btn, .track-btn').forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (this.audio) this.audio.playClick(1100);
      });
    });
  }

  /* Header scroll shrink */
  bindHeaderScroll() {
    const header = document.getElementById('site-header');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  /* Mood / Time Switcher */
  bindMoodSelector() {
    const moodBtns = document.querySelectorAll('.mood-btn');
    moodBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        moodBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const mood = btn.dataset.mood;
        document.documentElement.dataset.theme = mood;
        if (this.scene) {
          this.scene.setMood(mood);
        }

        // Live weather status update
        const weatherEl = document.getElementById('live-weather');
        if (weatherEl) {
          if (mood === 'night') {
            weatherEl.innerHTML = '<i data-lucide="moon"></i><span>15°C • Đêm Trời Trong & Trăng Sáng</span>';
          } else if (mood === 'sunset') {
            weatherEl.innerHTML = '<i data-lucide="sunset"></i><span>19°C • Hoàng Hôn Nắng Vàng Rực Rỡ</span>';
          } else if (mood === 'dawn') {
            weatherEl.innerHTML = '<i data-lucide="cloud-fog"></i><span>14°C • Sương Mù & Biển Mây Buổi Sớm</span>';
          }
          if (window.lucide) window.lucide.createIcons();
        }
      });
    });
  }

  /* Ambient Sound Controls */
  bindAudioControls() {
    const soundToggle = document.getElementById('sound-toggle');
    const zenCircle = document.getElementById('zen-circle');
    const zenIcon = document.getElementById('zen-play-icon');
    const volumeSlider = document.getElementById('sensory-volume');
    const trackBtns = document.querySelectorAll('.track-btn');

    const updateAudioState = (playing) => {
      if (playing) {
        soundToggle.classList.add('playing');
        if (zenIcon) zenIcon.setAttribute('data-lucide', 'pause');
      } else {
        soundToggle.classList.remove('playing');
        if (zenIcon) zenIcon.setAttribute('data-lucide', 'play');
      }
      if (window.lucide) window.lucide.createIcons();
    };

    soundToggle.addEventListener('click', () => {
      const playing = this.audio.toggle();
      updateAudioState(playing);
    });

    if (zenCircle) {
      zenCircle.addEventListener('click', () => {
        const playing = this.audio.toggle();
        updateAudioState(playing);
      });
    }

    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) / 100;
        this.audio.setVolume(val);
      });
    }

    trackBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        trackBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const soundType = btn.dataset.sound;
        this.audio.play(soundType);
        updateAudioState(true);
      });
    });
  }

  /* 3D Tilt Effect on Cards (ThreeUI Style) */
  bind3DTilt() {
    const tiltCards = document.querySelectorAll('[data-tilt]');
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }

  /* Filter Villa Tabs with Stacking Index Recalculation */
  bindVillaFilters() {
    const tabs = document.querySelectorAll('.tab-btn');
    const cards = document.querySelectorAll('.villa-card.stack-card');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.dataset.filter;
        let visibleIdx = 1;
        cards.forEach(card => {
          if (filter === 'all' || card.dataset.category.includes(filter)) {
            card.style.display = 'flex';
            card.style.setProperty('--card-index', visibleIdx);
            visibleIdx++;
          } else {
            card.style.display = 'none';
          }
        });
        if (window.ScrollTrigger) {
          ScrollTrigger.refresh();
        }
      });
    });
  }

  /* Modals & Drawer */
  bindModalsAndDrawers() {
    // Header Book CTA & Hero button
    const headerBtn = document.getElementById('header-book-btn');
    const heroBtn = document.getElementById('hero-explore-btn');
    const dockBtn = document.getElementById('dock-submit-btn');

    if (headerBtn) {
      headerBtn.addEventListener('click', () => window.openBookingDrawer('glass-pine'));
    }
    if (heroBtn) {
      heroBtn.addEventListener('click', () => {
        document.getElementById('villas')?.scrollIntoView({ behavior: 'smooth' });
      });
    }
    if (dockBtn) {
      dockBtn.addEventListener('click', () => {
        const selected = document.getElementById('dock-villa')?.value || 'glass-pine';
        window.openBookingDrawer(selected);
      });
    }

    // Close buttons
    const drawerClose = document.getElementById('drawer-close-btn');
    const drawerOverlay = document.getElementById('booking-drawer-overlay');
    if (drawerClose && drawerOverlay) {
      drawerClose.addEventListener('click', () => drawerOverlay.classList.remove('active'));
      drawerOverlay.addEventListener('click', (e) => {
        if (e.target === drawerOverlay) drawerOverlay.classList.remove('active');
      });
    }

    const modalClose = document.getElementById('modal-close-btn');
    const modalOverlay = document.getElementById('villa-modal-overlay');
    if (modalClose && modalOverlay) {
      modalClose.addEventListener('click', () => modalOverlay.classList.remove('active'));
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) modalOverlay.classList.remove('active');
      });
    }
  }

  /* 3D Virtual Tour Modal */
  bindTourModal() {
    const tourBtn = document.getElementById('virtual-tour-btn');
    const tourOverlay = document.getElementById('tour-modal-overlay');
    const tourClose = document.getElementById('tour-modal-close-btn');
    const camToggle = document.getElementById('hud-camera-toggle');

    if (tourBtn && tourOverlay) {
      tourBtn.addEventListener('click', () => tourOverlay.classList.add('active'));
      tourClose.addEventListener('click', () => tourOverlay.classList.remove('active'));
      tourOverlay.addEventListener('click', (e) => {
        if (e.target === tourOverlay) tourOverlay.classList.remove('active');
      });
    }

    if (camToggle) {
      camToggle.addEventListener('click', () => {
        if (this.scene) {
          this.scene.camera.position.z = this.scene.camera.position.z === 8 ? 5.5 : 8;
          this.showToast('Đã chuyển đổi tiêu cự camera 3D');
        }
      });
    }
  }

  showToast(msg) {
    const toast = document.getElementById('toast');
    const msgEl = document.getElementById('toast-msg');
    if (toast && msgEl) {
      msgEl.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3000);
    }
  }

  initLocationMap() {
    const mapCard = document.querySelector('.location-map-card');
    const shield = document.getElementById('map-shield');
    if (!mapCard || !shield) return;

    shield.addEventListener('click', () => {
      shield.classList.add('unlocked');
    });

    mapCard.addEventListener('mouseleave', () => {
      shield.classList.remove('unlocked');
    });
  }
}

// Global functions for inline HTML calls
window.openBookingDrawer = function(villaId = 'glass-pine') {
  const overlay = document.getElementById('booking-drawer-overlay');
  const select = document.getElementById('b-villa-select');
  if (select && villaId && villaId !== 'all') {
    select.value = villaId;
  }
  window.onDrawerVillaChange();
  overlay?.classList.add('active');
};

window.onDrawerVillaChange = function() {
  const select = document.getElementById('b-villa-select');
  const titleEl = document.getElementById('drawer-villa-title');
  if (!select) return;
  const villaKey = select.value;
  const villa = VILLAS_DATA[villaKey];
  if (villa && titleEl) {
    titleEl.textContent = villa.name;
  }
  window.calculateBookingTotal();
};

window.calculateBookingTotal = function() {
  const checkinVal = document.getElementById('b-checkin')?.value;
  const checkoutVal = document.getElementById('b-checkout')?.value;
  const select = document.getElementById('b-villa-select');
  if (!checkinVal || !checkoutVal || !select) return;

  const d1 = new Date(checkinVal);
  const d2 = new Date(checkoutVal);
  let nights = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
  if (nights < 1) nights = 1;

  const villa = VILLAS_DATA[select.value] || VILLAS_DATA['glass-pine'];
  const pricePerNight = villa.price;
  const roomSubtotal = pricePerNight * nights;

  let addonSubtotal = 0;
  if (document.getElementById('addon-dinner')?.checked) addonSubtotal += 650000;
  if (document.getElementById('addon-shuttle')?.checked) addonSubtotal += 900000;

  const discount = Math.round(roomSubtotal * 0.15);
  const total = (roomSubtotal + addonSubtotal) - discount;

  const formatVND = (num) => new Intl.NumberFormat('vi-VN').format(num) + '₫';

  const nightsEl = document.getElementById('summary-nights');
  const roomSubtotalEl = document.getElementById('summary-room-subtotal');
  const addonRow = document.getElementById('summary-addon-row');
  const addonSubtotalEl = document.getElementById('summary-addon-subtotal');
  const discountEl = document.getElementById('summary-discount');
  const totalEl = document.getElementById('summary-total');

  if (nightsEl) nightsEl.textContent = `${nights} đêm x ${formatVND(pricePerNight)}:`;
  if (roomSubtotalEl) roomSubtotalEl.textContent = formatVND(roomSubtotal);
  if (discountEl) discountEl.textContent = '-' + formatVND(discount);
  if (totalEl) totalEl.textContent = formatVND(total);

  if (addonRow && addonSubtotalEl) {
    if (addonSubtotal > 0) {
      addonRow.style.display = 'flex';
      addonSubtotalEl.textContent = '+' + formatVND(addonSubtotal);
    } else {
      addonRow.style.display = 'none';
    }
  }
};

window.submitBooking = function() {
  const name = document.getElementById('b-name')?.value;
  const phone = document.getElementById('b-phone')?.value;
  const villaSelect = document.getElementById('b-villa-select');
  const villaName = villaSelect?.options[villaSelect.selectedIndex]?.text.split('(')[0].trim();
  const total = document.getElementById('summary-total')?.textContent;

  document.getElementById('booking-drawer-overlay')?.classList.remove('active');

  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-msg');
  if (toast && msgEl) {
    msgEl.innerHTML = `<strong>Kính gửi ${name}!</strong> Đã xác nhận giữ chỗ căn <em>${villaName}</em> (${total}). Quản gia sẽ liên hệ số ${phone} trong 15 phút.`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 6000);
  }
};

window.openVillaModal = function(villaId) {
  const villa = VILLAS_DATA[villaId];
  if (!villa) return;

  const contentEl = document.getElementById('villa-modal-content');
  const overlay = document.getElementById('villa-modal-overlay');

  const formatVND = (num) => new Intl.NumberFormat('vi-VN').format(num) + '₫';

  contentEl.innerHTML = `
    <div class="modal-gallery" style="display: grid; grid-template-columns: 2fr 1fr; gap: 0.8rem; margin-bottom: 1.8rem; border-radius: 16px; overflow: hidden; height: 320px;">
      <img src="${villa.images[0]}" alt="${villa.name}" style="width: 100%; height: 100%; object-fit: cover;" />
      <div style="display: flex; flex-direction: column; gap: 0.8rem; height: 100%;">
        <img src="${villa.images[1] || villa.images[0]}" alt="${villa.name}" style="width: 100%; height: 50%; object-fit: cover;" />
        <img src="${villa.images[2] || villa.images[0]}" alt="${villa.name}" style="width: 100%; height: 50%; object-fit: cover;" />
      </div>
    </div>
    <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 1rem;">
      <h2 style="font-family: var(--font-serif-display); font-size: 1.8rem;">${villa.name}</h2>
      <span style="font-size: 1.3rem; font-weight: 700; color: var(--accent-gold);">${formatVND(villa.price)} <small style="font-size: 0.8rem; color: var(--text-muted); font-weight: normal;">/ đêm</small></span>
    </div>
    <div style="display: flex; gap: 1.5rem; color: var(--text-muted); font-size: 0.88rem; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-subtle);">
      <span><strong>Diện tích:</strong> ${villa.area}</span>
      <span><strong>Sức chứa:</strong> ${villa.guests}</span>
      <span><strong>Tầm nhìn:</strong> ${villa.view}</span>
    </div>
    <p style="color: var(--text-secondary); line-height: 1.75; margin-bottom: 1.8rem;">${villa.description}</p>
    <h4 style="font-family: var(--font-serif-display); font-size: 1.05rem; margin-bottom: 1rem; color: var(--accent-gold);">Tiện Nghi Độc Quyền & Dịch Vụ</h4>
    <ul style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; margin-bottom: 2.2rem; list-style: none; padding: 0;">
      ${villa.features.map(f => `<li style="font-size: 0.88rem; color: var(--text-secondary); display: flex; align-items: center; gap: 0.5rem;"><i data-lucide="check" style="width: 14px; height: 14px; color: var(--accent-emerald);"></i> ${f}</li>`).join('')}
    </ul>
    <div style="display: flex; justify-content: flex-end; gap: 1rem;">
      <button class="ghost-btn" onclick="document.getElementById('villa-modal-overlay').classList.remove('active')">Đóng</button>
      <button class="liquid-btn" onclick="document.getElementById('villa-modal-overlay').classList.remove('active'); window.openBookingDrawer('${villa.id}');">
        <span class="btn-text">Tiến Hành Đặt Căn Này</span>
        <span class="liquid-glow"></span>
      </button>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
  overlay?.classList.add('active');
};

// Start application on DOM Ready
window.addEventListener('DOMContentLoaded', () => {
  new App();
});
