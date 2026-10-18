/* =========================================================
   Minh Thuận Shoe Review – sneaker.js
   ========================================================= */

/* ---------- Dữ liệu sản phẩm (kèm tên file ảnh) ---------- */
var PRODUCTS = [
  { id: 1, name: "Ultraboost Light", desc: "Giày chạy bộ dùng đệm Boost, êm và hoàn trả lực tốt cho chạy đường dài.", price: 4500000, bg: "#D4F54A", img: "shoe-ultraboost-light" },
  { id: 2, name: "Samba OG",         desc: "Mẫu đế gum kinh điển từ giày bóng đá trong nhà, dễ phối đồ hằng ngày.", price: 2800000, bg: "#E9EAE3", img: "shoe-samba-og" },
  { id: 3, name: "Superstar",        desc: "Mũi vỏ sò nổi tiếng, form chắc chân, hợp đi học đi làm.",              price: 2600000, bg: "#FFFFFF", img: "shoe-superstar" },
  { id: 4, name: "Stan Smith",       desc: "Giày da trắng tối giản, vệ sinh dễ và mang được nhiều dịp.",          price: 2700000, bg: "#DFF0E4", img: "shoe-stan-smith" },
  { id: 5, name: "Gazelle",          desc: "Chất da lộn mềm, dáng thấp gọn, nhiều màu cho phong cách retro.",     price: 2900000, bg: "#CFE0F5", img: "shoe-gazelle" },
  { id: 6, name: "Campus 00s",       desc: "Đế dày kiểu thập niên 2000, hợp phong cách đường phố.",               price: 2900000, bg: "#E4D9F0", img: "shoe-campus-00s" }
];

/* ---------- Tiện ích ---------- */
function esc(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function money(n) {
  try { return new Intl.NumberFormat("vi-VN").format(n) + "đ"; }
  catch (e) { return n.toLocaleString("vi-VN") + "đ"; }
}

/* ---------- Fallback SVG ---------- */
var FALLBACK_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">' +
    '<rect width="400" height="300" fill="#E9EAE3"/>' +
    '<path d="M60 200c0-18 8-28 24-33l76-26c13-5 21-16 29-31l10-18 29 10c5 24 26 39 58 50l71 18c37 10 65 18 65 52v16H60z" fill="#5B6770"/>' +
    '<text x="200" y="278" font-family="sans-serif" font-size="16" text-anchor="middle" fill="#5B6770">Ảnh minh hoạ</text>' +
    '</svg>'
  );

/* ---------- Gán ảnh: tự nhận đuôi theo tên file ---------- */
function setImg(im, name) {
  if (!im) return;
  im.onerror = function () { this.onerror = null; this.src = FALLBACK_IMG; };

  /* Logo thanh toán dùng .png, còn lại dùng .jpg */
  var ext = name.indexOf("pay-") === 0 ? ".png" : ".jpg";
  im.src = "images/" + name + ext;
}

function imgs() {
  document.querySelectorAll("img[data-img]").forEach(function (im) {
    setImg(im, im.dataset.img);
  });
}

/* ---------- Giỏ hàng ---------- */
var mem = {};

function load() {
  try {
    var raw = localStorage.getItem("cart");
    if (!raw) return {};
    var parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return {};
    return parsed;
  } catch (e) { return mem && typeof mem === "object" ? mem : {}; }
}

function save(c) {
  mem = c;
  try { localStorage.setItem("cart", JSON.stringify(c)); } catch (e) {}
}

function count() {
  var c = load(), n = 0;
  for (var k in c) {
    if (Object.prototype.hasOwnProperty.call(c, k)) {
      var v = parseInt(c[k], 10);
      if (!isNaN(v) && v > 0) n += v;
    }
  }
  return n;
}

function badge() {
  var e = document.getElementById("cartN");
  if (e) e.textContent = String(count());
}

function add(id) {
  var c = load();
  var key = String(id);
  c[key] = (parseInt(c[key], 10) || 0) + 1;
  save(c); badge();
}

/* ---------- Render sản phẩm ---------- */
function card(p) {
  var d = document.createElement("article");
  d.className = "prod";
  d.innerHTML =
    '<div class="shot" style="background:' + esc(p.bg) + '">' +
      '<img data-img="' + esc(p.img) + '" alt="' + esc(p.name) + '" loading="lazy" width="400" height="300">' +
    '</div>' +
    '<div class="body">' +
      '<h3>' + esc(p.name) + '</h3>' +
      '<p>' + esc(p.desc) + '</p>' +
      '<div class="price">' +
        '<b>' + money(p.price) + '</b>' +
        '<button class="btn" type="button">Thêm vào giỏ</button>' +
      '</div>' +
    '</div>';

  d.querySelector("button").onclick = function () {
    add(p.id);
    this.textContent = "Đã thêm ✓";
    var self = this;
    setTimeout(function () { self.textContent = "Thêm vào giỏ"; }, 1200);
  };

  var img = d.querySelector("img[data-img]");
  setImg(img, img.dataset.img);

  return d;
}

function grid(limit) {
  var g = document.getElementById("grid");
  if (!g) return;
  PRODUCTS.slice(0, limit || 99).forEach(function (p) { g.appendChild(card(p)); });
}

/* ---------- Giỏ hàng (cart.html) ---------- */
function renderCart() {
  var box = document.getElementById("cartBox");
  if (!box) return;

  var c = load();
  var ids = Object.keys(c).filter(function (k) { return parseInt(c[k], 10) > 0; });

  if (!ids.length) {
    box.innerHTML =
      '<p class="lead">Giỏ hàng đang trống. ' +
      '<a href="products.html" style="text-decoration:underline">Xem sản phẩm</a> để thêm giày.</p>';
    return;
  }

  var t = 0;
  var h = '<table class="cart"><thead><tr>' +
          '<th>Sản phẩm</th><th>Đơn giá</th><th>Số lượng</th><th>Thành tiền</th>' +
          '</tr></thead><tbody>';

  ids.forEach(function (k) {
    var p = PRODUCTS.filter(function (x) { return String(x.id) === String(k); })[0];
    if (!p) return;
    var qty = parseInt(c[k], 10) || 0;
    var s = p.price * qty;
    t += s;
    h += '<tr>' +
      '<td>' + esc(p.name) + '</td>' +
      '<td>' + money(p.price) + '</td>' +
      '<td class="qty">' +
        '<button data-d="-1" data-id="' + esc(k) + '" aria-label="Giảm">−</button> ' +
        qty +
        ' <button data-d="1" data-id="' + esc(k) + '" aria-label="Tăng">+</button>' +
      '</td>' +
      '<td>' + money(s) + '</td>' +
    '</tr>';
  });

  var ship = t >= 2000000
    ? "Được miễn phí giao hàng."
    : "Mua thêm " + money(2000000 - t) + " để được miễn phí giao hàng.";

  h += '</tbody></table>' +
       '<p class="total">Tổng: ' + money(t) + '</p>' +
       '<p class="lead">' + ship + '</p>' +
       '<div class="row">' +
         '<button class="btn fill" id="pay" type="button">Thanh toán</button>' +
         '<button class="btn" id="clr" type="button">Xóa giỏ hàng</button>' +
       '</div>' +
       '<p class="msg" id="payOut" aria-live="polite"></p>';

  box.innerHTML = h;

  box.querySelectorAll(".qty button").forEach(function (b) {
    b.onclick = function () {
      var c2 = load();
      var id = b.dataset.id;
      var cur = parseInt(c2[id], 10) || 0;
      var next = cur + parseInt(b.dataset.d, 10);
      if (next <= 0) delete c2[id]; else c2[id] = next;
      save(c2); badge(); renderCart();
    };
  });

  var clr = document.getElementById("clr");
  if (clr) clr.onclick = function () {
    if (confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng?")) {
      save({}); badge(); renderCart();
    }
  };

  
  var pay = document.getElementById("pay");
  if (pay) pay.onclick = function () {
    location.href = "checkout.html";
  };
}

/* ---------- Banner trang chủ ---------- */
function banner() {
  var bs = document.querySelectorAll(".slides button");
  if (!bs.length) return;
  if (!document.getElementById("hTitle") || !document.getElementById("hText")) return;

  var B = [
    ["Adidas thật,", "review thật.", "Minh Thuận review Adidas theo trải nghiệm thật: mang thử, so sánh form, đệm và độ bền trước khi bạn xuống tiền."],
    ["Chạy êm,", "đi xa hơn.", "Từ Ultraboost đến Samba, mỗi mẫu đều được mang nhiều tuần rồi mới viết review."],
    ["Đúng size,", "đúng chân.", "Đo chiều dài bàn chân và xem gợi ý size ở trang Bí quyết chọn giày."]
  ];

  var cur = 0, t = null;

  function show(i) {
    cur = i;
    var im = document.querySelector(".heroimg");
    if (im) setImg(im, "hero-adidas-" + (i + 1));
    bs.forEach(function (b, k) { b.classList.toggle("on", k === i); });
    document.getElementById("hTitle").innerHTML =
      esc(B[i][0]) + "<span>" + esc(B[i][1]) + "</span>";
    document.getElementById("hText").textContent = B[i][2];
  }

  function start() {
    if (matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    stop();
    t = setInterval(function () { show((cur + 1) % 3); }, 5000);
  }

  function stop() { if (t) { clearInterval(t); t = null; } }

  bs.forEach(function (b, i) { b.onclick = function () { show(i); start(); }; });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop(); else start();
  });

  show(0);
  start();
}

/* ---------- Form ---------- */
function forms() {
  var s = document.getElementById("sizeBtn");
  if (s) s.onclick = function () {
    var v = parseFloat(document.getElementById("cm").value);
    var o = document.getElementById("sizeOut");
    if (!v || v < 20 || v > 32) {
      o.textContent = "Hãy nhập chiều dài từ 20 đến 32 cm.";
      return;
    }
    var eu = Math.round((v + 1.5) * 1.5);
    o.textContent = "Tham khảo: size EU " + eu +
      " (đã cộng khoảng 1,5 cm chừa chỗ cho ngón chân). " +
      "Bàn chân bè nên thử tăng nửa size. " +
      "Hãy đối chiếu với bảng size chính thức của Adidas.";
  };

  var f = document.getElementById("sub");
  if (f) f.onsubmit = function (e) {
    e.preventDefault();
    var mail = document.getElementById("mail").value;
    document.getElementById("subOut").textContent = "Đã đăng ký. Mã giảm giá sẽ gửi tới " + mail + ".";
  };

  var c = document.getElementById("contactForm");
  if (c) c.onsubmit = function (e) {
    e.preventDefault();
    document.getElementById("contactOut").textContent =
      "Đã nhận tin nhắn của bạn. Form này chưa gửi đi đâu, bạn cần nối với email hoặc máy chủ thật.";
  };

  authForms();
}

/* ---------- Đăng ký / Đăng nhập ---------- */
var store = {};

function lget(k, d) {
  try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; }
  catch (e) { return store[k] != null ? store[k] : d; }
}

function lset(k, v) {
  store[k] = v;
  try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
}

function hash(t) {
  var h = 5381;
  for (var i = 0; i < t.length; i++) h = ((h << 5) + h + t.charCodeAt(i)) | 0;
  return String(h);
}

function authBox() {
  var b = document.getElementById("authBox");
  if (!b) return;
  var me = lget("session", null);
  if (me && typeof me === "object") {
    b.innerHTML = '<b>Xin chào, ' + esc(me.name || "") + '</b>' +
      '<button class="btn" type="button" id="logout">Đăng xuất</button>';
    var out = document.getElementById("logout");
    if (out) out.onclick = function () {
      lset("session", null);
      location.href = "index.html";
    };
  } else {
    b.innerHTML =
      '<a class="btn" href="register.html">Đăng ký</a>' +
      '<a class="btn fill" href="login.html">Đăng nhập</a>';
  }
}

function authForms() {
  var r = document.getElementById("registerForm");
  var l = document.getElementById("loginForm");
  var o = document.getElementById("authOut");

  if (r) r.onsubmit = function (e) {
    e.preventDefault();
    var n = r.rname.value.trim();
    var m = r.remail.value.trim().toLowerCase();
    var p = r.rpass.value;
    var c = r.rconfirm.value;
    var u = lget("users", []);

    if (n.length < 2) { o.textContent = "Hãy nhập họ tên."; return; }
    if (p.length < 6) { o.textContent = "Mật khẩu cần ít nhất 6 ký tự."; return; }
    if (p !== c) { o.textContent = "Mật khẩu nhập lại chưa khớp."; return; }
    if (u.some(function (x) { return x.email === m; })) {
      o.textContent = "Email này đã đăng ký. Hãy đăng nhập."; return;
    }

    u.push({ name: n, email: m, pass: hash(p) });
    lset("users", u);
    lset("session", { name: n, email: m });
    o.textContent = "Đăng ký thành công. Đang chuyển về trang chủ...";
    setTimeout(function () { location.href = "index.html"; }, 1200);
  };

  if (l) l.onsubmit = function (e) {
    e.preventDefault();
    var m = l.lemail.value.trim().toLowerCase();
    var p = l.lpass.value;
    var u = lget("users", []).filter(function (x) {
      return x.email === m && x.pass === hash(p);
    })[0];

    if (!u) {
      o.textContent = "Email hoặc mật khẩu chưa đúng. Nếu chưa có tài khoản, hãy đăng ký.";
      return;
    }
    lset("session", { name: u.name, email: u.email });
    o.textContent = "Đăng nhập thành công. Đang chuyển về trang chủ...";
    setTimeout(function () { location.href = "index.html"; }, 1000);
  };
}

/* ---------- Khởi động ---------- */
document.addEventListener("DOMContentLoaded", function () {
  badge();
  grid(parseInt(document.body.dataset.limit, 10) || 99);
  renderCart();
  banner();
  forms();
  authBox();
  imgs();
});