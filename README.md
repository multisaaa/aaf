# AAF Website

เว็บไซต์แบบ static ใช้ HTML, CSS และ JavaScript โดยตรง ไม่มีขั้นตอน build และควรเปิดผ่าน HTTP server เพื่อให้ JavaScript modules ทำงานครบถ้วน

## โครงสร้างไฟล์

```text
.
├── index.html          # หน้า Home
├── pages/              # HTML ของหน้าภายในเว็บไซต์
├── css/
│   ├── tokens.css      # สี ฟอนต์ ระยะห่าง และค่ากลาง
│   ├── global.css      # รูปแบบพื้นฐานของเว็บไซต์
│   ├── components.css  # รวม CSS ของ component ที่ใช้ร่วมกัน
│   ├── components/    # Header, Footer, navigation, forms และ animation
│   └── pages/         # CSS ของแต่ละหน้าและรูปแบบร่วมของหน้าภายใน
├── js/
│   ├── main.js         # เริ่มพฤติกรรมที่ใช้ร่วมกันทุกหน้า
│   ├── config.js       # Breakpoint และระยะเวลา interaction
│   ├── pages/          # เริ่มพฤติกรรมเฉพาะหน้า
│   ├── utils/          # Helper ที่ใช้ซ้ำ
│   └── vendor/         # GSAP และ SplitText
└── assets/
    ├── images/         # รูปภาพ แยกตามเนื้อหา
    ├── icons/          # Icon ธงภาษา, social media และไฟล์สิทธิ์การใช้งาน
    └── logos/          # Logo และ favicon
```

## HTML

`index.html` เป็นหน้า Home ส่วนหน้าภายในอยู่ใน `pages/` ตามชื่อเนื้อหา:

| กลุ่มเนื้อหา          | ไฟล์                                                                                                                                                                          |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| บริษัท                | `about-us.html`, `sustainability.html`                                                                                                                                        |
| สินค้าและการใช้งาน    | `wet-process-hardboard.html`, `glass-bottle-layer-pads.html`, `coil-packaging-components.html`, `automotive-interior-components.html`, `building-furniture-distribution.html` |
| ข้อมูลเทคนิคและคุณภาพ | `technical-resources.html`, `quality-compliance.html`                                                                                                                         |
| ติดต่อและขอราคา       | `contact-us.html`, `request-a-quote.html`                                                                                                                                     |
| นโยบาย                | `privacy.html`                                                                                                                                                                |

เนื้อหา ข้อความ รูปภาพ ลิงก์ และ metadata แก้ใน HTML ของหน้านั้นโดยตรง แต่ละหน้ามี Header และ Footer อยู่ในไฟล์ของตัวเอง หากแก้ส่วนที่ใช้ร่วมกันต้องปรับให้ตรงกันทุกหน้า

`body[data-page]` ระบุชื่อหน้า และ `[data-subpage-root]` ระบุส่วนเนื้อหาที่ JavaScript ของหน้าภายในใช้เริ่มทำงาน ส่วน `data-*` อื่นเป็นจุดเชื่อมกับ interaction เช่น รูปที่โหลดภายหลังและแผนที่ ควรคง attribute เหล่านี้เมื่อปรับ markup

หน้า Home ใช้ path เช่น `assets/...` ส่วน HTML ใน `pages/` ใช้ `../assets/...` ให้รักษาโครงสร้างโฟลเดอร์เพื่อให้ลิงก์และไฟล์ประกอบยังทำงาน

## CSS

ลำดับ stylesheet ใน HTML มีผลต่อการแสดงผล ควรเรียงตามหน้าที่ดังนี้:

1. `css/tokens.css` กำหนดค่ากลาง เช่น สี ฟอนต์ ระยะห่าง และ radius
2. `css/global.css` กำหนด reset, typography และรูปแบบพื้นฐาน รวมถึงโหลด CSS ของ preloader
3. `css/components.css` โหลด stylesheet ที่ใช้ร่วมกันจาก `css/components/` ตามลำดับที่ระบุในไฟล์
4. CSS ของหน้า: Home ใช้ `css/pages/home.css`; หน้าภายในใช้ `css/pages/subpages.css` แล้วจึงโหลด CSS เฉพาะหน้าที่จำเป็น
5. หน้าภายในโหลด `css/pages/subpages/subpage-interactions.css` หลัง CSS เฉพาะหน้า เพื่อให้ hover, focus และสถานะ interaction มีลำดับ override ที่ถูกต้อง

`css/components/` แบ่งตามส่วนของ UI เช่น `header.css`, `navigation.css`, `footer.css`, `cards.css`, `tables.css`, `forms.css`, `buttons.css`, `image-loading.css`, `motion.css` และ `preloader.css`

`css/pages/subpages.css` รวมรูปแบบร่วมของหน้าภายใน เช่น hero, layout, content, ตาราง และ responsive ส่วนไฟล์อย่าง `css/pages/contact-us.css` หรือ `css/pages/glass-bottle-layer-pads.css` เป็นไฟล์รวมที่ import รูปแบบเฉพาะหน้าจาก `css/pages/subpages/`

หากแก้สีหรือระยะห่างทั้งเว็บไซต์ให้เริ่มที่ `tokens.css`; หากแก้ component ที่ใช้หลายหน้าให้แก้ใน `components/`; หากแก้เฉพาะหน้าให้แก้ CSS ของหน้านั้น ตรวจทั้ง desktop และ mobile เพราะมี media queries และบาง selector ใช้ `!important` เพื่อกำหนดลำดับ override

## JavaScript

`js/motion-boot.js` โหลดใน `<head>` เพื่อเตรียม loading และการเผยหน้าเว็บ ส่วนท้าย HTML โหลด GSAP, SplitText, `js/main.js` และ module ของหน้านั้นตามลำดับ

| ไฟล์หรือโฟลเดอร์                                                 | หน้าที่                                                                               |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `js/main.js`                                                     | เริ่ม navigation, language switcher, scroll reveal, image loading และ page transition |
| `js/config.js`                                                   | เก็บ breakpoint และระยะเวลาที่หลาย module ใช้ร่วมกัน                                  |
| `js/navigation.js`                                               | เมนู desktop/mobile พร้อม keyboard และ focus behavior                                 |
| `js/language-switcher.js`                                        | เปลี่ยนธง รหัสภาษา และบันทึกภาษาที่เลือก                                              |
| `js/hero-heading.js`, `js/hero-parallax.js`, `js/kpi-counter.js` | Animation ของหัวข้อ ภาพ hero และตัวเลข                                                |
| `js/scroll-reveal.js`, `js/image-loading.js`                     | เผยส่วนเนื้อหาเมื่อเลื่อนหน้าและจัดการสถานะรูปภาพ                                     |
| `js/motion-boot.js`, `js/page-transition.js`                     | Loading ตอนเข้าหน้าและ transition ระหว่างหน้าภายใน                                    |
| `js/utils/page-reveal.js`                                        | รอให้หน้าเว็บเผยก่อนเริ่ม animation                                                   |
| `js/utils/details-disclosure.js`                                 | Helper สำหรับเปิด/ปิด `<details>` ที่ใช้กับเมนูและตัวเลือกภาษา                        |
| `js/pages/`                                                      | Entry point และพฤติกรรมเฉพาะหน้าตามชื่อ HTML                                          |
| `js/vendor/`                                                     | Library ที่ animation ใช้งาน                                                          |

`js/pages/home.js` เริ่ม hero, parallax และ counter ส่วนหน้าภายในเรียก `initSubpage()` จาก `js/pages/subpage.js` เพื่อเริ่ม hero ที่ใช้ร่วมกัน แล้วจึงเริ่มพฤติกรรมเฉพาะหน้า เช่น:

- `contact-us.js`: ฟอร์มติดต่อและแผนที่จาก `data-map-src` / `data-map-title` ใน HTML
- `request-a-quote.js`: ฟอร์มขอราคา การเติมค่าจาก URL และตรวจข้อมูลก่อนเปิด email client
- `wet-process-hardboard.js`: โหลด `manufacturing-story.js` สำหรับส่วนแสดงกระบวนการผลิต
- `sustainability.js`: Interaction ภายในหน้า Sustainability

Loading จดจำการเข้าครั้งแรกของแต่ละแท็บผ่าน `sessionStorage`; animation ที่ต้องรอหน้าเผยใช้ event `aaf:page-reveal` และ helper กลาง พฤติกรรม animation รองรับการตั้งค่า reduced motion ของผู้ใช้

Language switcher เปลี่ยนสถานะภาษาและ `html.lang` แต่ยังไม่ได้แปลข้อความในหน้า ส่วนฟอร์มติดต่อและขอราคาใช้ `mailto:` เพื่อเปิด email client ไม่มีระบบส่งอีเมลหรืออัปโหลดไฟล์ฝั่ง server โดยฟอร์มขอราคาตรวจขนาดไฟล์ไม่เกิน 10 MB และผู้ใช้ต้องแนบไฟล์เองในอีเมล

## Assets

รูปภาพส่วนใหญ่เป็น WebP และแยกใน `assets/images/` ตามกลุ่ม เช่น `home/`, `company/`, `material/`, `process/`, `glass/`, `coil/`, `automotive/`, `building/`, `quality/`, `logistics/`, `sustainability/` และ `shared/`

- รูปเนื้อหาถูกอ้างจาก HTML ผ่าน `src` หรือ `data-src`
- รูปพื้นหลังบางส่วนถูกอ้างด้วย `url(...)` ใน CSS
- Icon ธงภาษาอยู่ใน `assets/icons/` และอ้างจากทั้ง HTML และ JavaScript
- Icon Facebook, WhatsApp และ LINE อยู่ใน `assets/icons/facebook.svg`, `whatsapp.svg` และ `line.svg` โดย HTML เรียกใช้ผ่าน `<svg><use href="...#icon"></use></svg>` เพื่อใช้ไฟล์ร่วมกันทุกหน้าและรับสีจาก CSS
- Logo และ favicon อยู่ใน `assets/logos/`

เมื่อเปลี่ยนชื่อหรือย้าย asset ให้แก้จุดอ้างอิงใน HTML, CSS และ JavaScript ที่เกี่ยวข้อง พร้อมปรับ `alt` ของรูปเนื้อหาให้สอดคล้องกัน ไฟล์ `assets/icons/LICENSE-circle-flags.txt` เป็นข้อมูลสิทธิ์การใช้งานของ icon และควรเก็บไว้กับ assets
