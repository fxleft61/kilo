const key = "denge-weight-records";
const goalKey = "denge-weight-goal";
const heightKey = "denge-height";
const recipeMenuKey = "denge-recipe-menu";
const seenMenusKey = "denge-seen-recipe-menus";
const favoritesKey = "denge-favorite-recipes";
const form = document.querySelector("#weightForm");
const goalForm = document.querySelector("#goalForm");
const heightForm = document.querySelector("#heightForm");
const weightInput = document.querySelector("#weightInput");
const dateInput = document.querySelector("#dateInput");
const goalInput = document.querySelector("#goalInput");
const heightInput = document.querySelector("#heightInput");
const byId = (id) => document.getElementById(id);
const formatter = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric" });
const shortFormatter = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short" });
const menus = [
  [
    { meal: "KAHVALTI", name: "Yoğurtlu yulaf kasesi", calories: 340, ingredients: "4 yemek kaşığı yulaf, yoğurt, yarım muz, tarçın", steps: "Malzemeleri kasede karıştır. Muzu dilimleyip üzerine ekle." },
    { meal: "ÖĞLE", name: "Nohutlu Akdeniz salatası", calories: 430, ingredients: "Haşlanmış nohut, domates, salatalık, yeşillik, zeytinyağı", steps: "Tüm malzemeleri doğra, nohut ve 1 tatlı kaşığı zeytinyağıyla karıştır." },
    { meal: "AKŞAM", name: "Fırında tavuk ve sebze", calories: 510, ingredients: "Tavuk göğsü, kabak, biber, havuç, baharat", steps: "Sebze ve tavuğu baharatla harmanla. 200°C fırında yaklaşık 25 dakika pişir." }
  ],
  [
    { meal: "KAHVALTI", name: "Peynirli omlet", calories: 350, ingredients: "2 yumurta, lor peyniri, ıspanak, 1 dilim tam tahıllı ekmek", steps: "Ispanağı kısa süre çevir, yumurta ve peyniri ekleyip pişir." },
    { meal: "ÖĞLE", name: "Mercimek çorbası ve salata", calories: 390, ingredients: "1 kase mercimek çorbası, mevsim salatası, yoğurt", steps: "Çorbayı servis et. Salatayı limonla tamamla, yanında yoğurtla tüket." },
    { meal: "AKŞAM", name: "Somonlu bulgur tabağı", calories: 540, ingredients: "Somon, 4 kaşık bulgur, roka, limon", steps: "Somonu tavada veya fırında pişir. Bulgur ve rokalı salatayla servis et." }
  ],
  [
    { meal: "KAHVALTI", name: "Meyveli chia puding", calories: 320, ingredients: "2 yemek kaşığı chia, süt, çilek veya elma, ceviz", steps: "Chiayı sütle karıştırıp dinlendir. Meyve ve cevizi ekle." },
    { meal: "ÖĞLE", name: "Tam tahıllı ton balıklı sandviç", calories: 440, ingredients: "Tam tahıllı ekmek, ton balığı, yoğurt, marul, domates", steps: "Ton balığını az yoğurtla karıştır, sebzelerle ekmeğin arasına koy." },
    { meal: "AKŞAM", name: "Sebzeli hindi sote", calories: 480, ingredients: "Hindi kuşbaşı, mantar, biber, brokoli, baharat", steps: "Hindiyi tavada mühürle. Sebzeleri ekleyip diri kalacak şekilde pişir." }
  ],
  [
    { meal: "KAHVALTI", name: "Avokadolu yumurtalı tost", calories: 360, ingredients: "Tam tahıllı ekmek, yarım avokado, yumurta, limon", steps: "Ekmeği kızart. Avokadoyu ezip limonla karıştır, yumurtayla birlikte servis et." },
    { meal: "ÖĞLE", name: "Tavuklu sebzeli wrap", calories: 460, ingredients: "Tam buğday lavaş, tavuk, yoğurtlu sos, marul, havuç", steps: "Pişmiş tavuğu ve sebzeleri lavaşa koy, yoğurtlu sosla sar." },
    { meal: "AKŞAM", name: "Kıymalı kabak sandal", calories: 490, ingredients: "Kabak, az yağlı kıyma, domates, soğan, yoğurt", steps: "Kabukları oyulmuş kabağı kıymalı harçla doldur, fırında pişir." }
  ],
  [
    { meal: "KAHVALTI", name: "Elmalı tarçınlı pankek", calories: 330, ingredients: "Yulaf unu, yumurta, elma, tarçın, yoğurt", steps: "Malzemeleri karıştırıp küçük pankekler halinde tavada pişir." },
    { meal: "ÖĞLE", name: "Yoğurtlu semizotu kasesi", calories: 400, ingredients: "Semizotu, yoğurt, haşlanmış mercimek, ceviz, limon", steps: "Semizotunu yoğurt ve mercimekle karıştır, cevizi üzerine serpiştir." },
    { meal: "AKŞAM", name: "Fırın köfte ve salata", calories: 520, ingredients: "Yağsız köfte, patates, domates, bol yeşillik", steps: "Köfte ve sebzeleri fırında pişir; yanında limonlu salata tüket." }
  ],
  [
    { meal: "KAHVALTI", name: "Kefirli meyve smoothie", calories: 310, ingredients: "Kefir, muz, yaban mersini, yulaf", steps: "Tüm malzemeleri blenderdan geçir, soğuk tüket." },
    { meal: "ÖĞLE", name: "Zeytinyağlı fasulye tabağı", calories: 420, ingredients: "Taze fasulye, domates, soğan, esmer pirinç, yoğurt", steps: "Fasulyeyi az zeytinyağıyla pişir, yanında pirinç ve yoğurtla servis et." },
    { meal: "AKŞAM", name: "Mantarlı tavuk çorbası", calories: 450, ingredients: "Tavuk, mantar, havuç, kereviz, yoğurt", steps: "Tavuk ve sebzeleri haşla; yoğurtla kıvamlandırarak servis et." }
  ]
];

function localDate(value = new Date()) { const offset = value.getTimezoneOffset(); return new Date(value.getTime() - offset * 60000).toISOString().slice(0, 10); }
function records() { try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; } }
function save(items) { localStorage.setItem(key, JSON.stringify(items)); }
function goal() { const value = Number(localStorage.getItem(goalKey)); return Number.isFinite(value) && value > 0 ? value : null; }
function height() { const value = Number(localStorage.getItem(heightKey)); return Number.isFinite(value) && value >= 80 && value <= 250 ? value : null; }
function savedFavorites() { try { return JSON.parse(localStorage.getItem(favoritesKey)) || []; } catch { return []; } }
function saveFavorites(items) { localStorage.setItem(favoritesKey, JSON.stringify(items)); }
function pretty(value) { return Number(value).toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }); }
function signed(value) { return `${value > 0 ? "+" : ""}${pretty(value)}`; }
function dateFrom(value) { return new Date(`${value}T12:00:00`); }

function render() {
  const items = records().sort((a,b) => a.date.localeCompare(b.date));
  const latest = items.at(-1);
  const before = items.at(-2);
  const list = byId("historyList");
  if (!latest) {
    byId("currentWeight").textContent = "—"; byId("averageWeight").textContent = "—"; byId("totalDifference").textContent = "—";
    byId("differenceText").textContent = "Bugünkü ölçümünü ekleyerek başla."; list.innerHTML = '<li class="empty">Henüz kayıt yok.</li>'; renderGoal(null); renderBmi(null); return;
  }
  byId("currentWeight").textContent = pretty(latest.weight);
  renderGoal(latest.weight);
  renderBmi(latest.weight);
  const recent = items.slice(-7); const avg = recent.reduce((sum, item) => sum + item.weight, 0) / recent.length;
  byId("averageWeight").textContent = pretty(avg);
  const total = latest.weight - items[0].weight; byId("totalDifference").textContent = total === 0 ? "0,0" : signed(total); byId("totalUnit").textContent = "kg";
  if (before) {
    const diff = latest.weight - before.weight;
    byId("differenceText").textContent = diff === 0 ? "Dünkü ölçümünle aynı." : `Düne göre ${Math.abs(diff).toLocaleString("tr-TR", {maximumFractionDigits:1})} kg ${diff < 0 ? "azaldı" : "arttı"}.`;
    const title = diff < 0 ? "Düşüş eğilimi var" : diff > 0 ? "Yükseliş eğilimi var" : "Dengeli gidiyorsun";
    byId("analysisTitle").textContent = title;
    byId("analysisText").textContent = `Son ${recent.length} kaydın ortalaması ${pretty(avg)} kg. Yarın da benzer saatte ölçerek daha sağlıklı bir ortalama oluşturabilirsin.`;
  }
  list.innerHTML = [...items].reverse().slice(0, 10).map((item, index, all) => {
    const next = all[index + 1]; const diff = next ? item.weight - next.weight : null;
    return `<li><span>${shortFormatter.format(dateFrom(item.date))}</span><strong>${pretty(item.weight)} kg</strong><span class="small-diff">${diff === null ? "İlk kayıt" : diff === 0 ? "—" : `${signed(diff)} kg`}</span></li>`;
  }).join("");
}

function currentMenuIndex() {
  const saved = Number(localStorage.getItem(recipeMenuKey));
  if (Number.isInteger(saved) && saved >= 0 && saved < menus.length) return saved;
  const initial = (new Date().getDate() + new Date().getMonth()) % menus.length;
  localStorage.setItem(recipeMenuKey, String(initial));
  localStorage.setItem(seenMenusKey, JSON.stringify([initial]));
  return initial;
}

function recipeId(recipe) { return recipe.name.toLocaleLowerCase("tr-TR").replaceAll(" ", "-"); }

function renderRecipes() {
  const menu = menus[currentMenuIndex()];
  const total = menu.reduce((sum, recipe) => sum + recipe.calories, 0);
  const favorites = savedFavorites();
  byId("dailyCalories").textContent = `${total.toLocaleString("tr-TR")} kcal`;
  byId("recipeList").innerHTML = menu.map((recipe) => {
    const id = recipeId(recipe); const isFavorite = favorites.some((item) => item.id === id);
    return `<article class="recipe"><div class="recipe-top"><span class="meal-tag">${recipe.meal}</span><div class="recipe-actions"><span class="recipe-calories">${recipe.calories} kcal</span><button class="favorite-button ${isFavorite ? "is-favorite" : ""}" type="button" data-recipe-id="${id}" aria-label="${isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}" aria-pressed="${isFavorite}">♥</button></div></div><h3>${recipe.name}</h3><p>${recipe.ingredients}</p><details><summary>Tarifi gör</summary><p>${recipe.steps}</p></details></article>`;
  }).join("");
  renderFavorites(favorites);
}

function renderFavorites(favorites = savedFavorites()) {
  const list = byId("favoritesList");
  if (!favorites.length) { list.innerHTML = '<p class="empty-favorites">Beğendiğin tarifleri kalp simgesine dokunarak buraya ekleyebilirsin.</p>'; return; }
  list.innerHTML = favorites.map((recipe) => `<div class="favorite-item"><div><strong>${recipe.name}</strong><span>${recipe.meal} · ${recipe.calories} kcal</span></div><button class="remove-favorite" type="button" data-remove-id="${recipe.id}">Kaldır</button></div>`).join("");
}

function showNextMenu() {
  const active = currentMenuIndex();
  let seen; try { seen = JSON.parse(localStorage.getItem(seenMenusKey)) || []; } catch { seen = []; }
  let available = menus.map((_, index) => index).filter((index) => !seen.includes(index) && index !== active);
  if (!available.length) { seen = [active]; available = menus.map((_, index) => index).filter((index) => index !== active); }
  const next = available[Math.floor(Math.random() * available.length)];
  localStorage.setItem(recipeMenuKey, String(next));
  localStorage.setItem(seenMenusKey, JSON.stringify([...seen, next]));
  renderRecipes();
}

function toggleFavorite(id) {
  const recipe = menus.flat().find((item) => recipeId(item) === id); if (!recipe) return;
  const favorites = savedFavorites(); const existing = favorites.findIndex((item) => item.id === id);
  if (existing >= 0) favorites.splice(existing, 1); else favorites.unshift({ ...recipe, id });
  saveFavorites(favorites); renderRecipes();
}

function renderBmi(currentWeight) {
  const userHeight = height(); const title = byId("bmiTitle"); const value = byId("bmiValue"); const text = byId("bmiText");
  if (!userHeight) { title.textContent = "Boyunu ekleyerek hesapla"; value.textContent = "—"; text.textContent = "Kayıtlar sayfasından boyunu eklediğinde VKİ otomatik hesaplanır."; return; }
  if (currentWeight === null) { title.textContent = `${pretty(userHeight)} cm boy kaydedildi`; value.textContent = "—"; text.textContent = "Güncel kilonu eklediğinde VKİ otomatik hesaplanacak."; return; }
  const bmi = currentWeight / ((userHeight / 100) ** 2);
  title.textContent = `${pretty(userHeight)} cm boy ile hesaplandı`;
  value.textContent = bmi.toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  text.textContent = `Güncel ${pretty(currentWeight)} kg ölçümün üzerinden hesaplanan VKİ değerin.`;
}

function renderGoal(currentWeight) {
  const target = goal();
  const title = byId("goalTitle"); const displayed = byId("goalWeight"); const text = byId("goalText"); const bar = byId("progressBar");
  if (!target) { title.textContent = "Hedef kilo belirle"; displayed.textContent = "—"; text.textContent = "Kayıtlar sayfasından hedefini eklediğinde ilerlemeni göreceksin."; bar.style.width = "0%"; return; }
  displayed.textContent = `${pretty(target)} kg`;
  if (currentWeight === null) { title.textContent = "İlk ölçümünü bekliyor"; text.textContent = "Hedefin kaydedildi. İlk ölçümünle ilerleme hesaplanacak."; bar.style.width = "0%"; return; }
  const remaining = Math.abs(currentWeight - target);
  const direction = currentWeight > target ? "kaldı" : currentWeight < target ? "altındasın" : "ulaştın";
  title.textContent = direction === "ulaştın" ? "Hedefine ulaştın!" : "Hedefe doğru ilerliyorsun";
  text.textContent = direction === "ulaştın" ? "Tebrikler, belirlediğin hedef kilodasın." : `Hedefine ${pretty(remaining)} kg ${direction}.`;
  const first = records().sort((a,b) => a.date.localeCompare(b.date))[0]?.weight;
  const startingDistance = first ? Math.abs(first - target) : remaining;
  const progress = startingDistance === 0 ? 100 : Math.min(100, Math.max(0, ((startingDistance - remaining) / startingDistance) * 100));
  bar.style.width = `${progress}%`;
}

dateInput.value = localDate();
byId("todayLabel").textContent = formatter.format(new Date());
form.addEventListener("submit", (event) => {
  event.preventDefault(); const weight = Number(String(weightInput.value).replace(",", "."));
  if (!Number.isFinite(weight) || weight < 20 || weight > 500) return;
  const items = records().filter((item) => item.date !== dateInput.value); items.push({ date: dateInput.value, weight }); save(items); weightInput.value = ""; render();
});
goalForm.addEventListener("submit", (event) => {
  event.preventDefault(); const target = Number(String(goalInput.value).replace(",", "."));
  if (!Number.isFinite(target) || target < 20 || target > 500) return;
  localStorage.setItem(goalKey, String(target)); goalInput.value = ""; render();
});
heightForm.addEventListener("submit", (event) => {
  event.preventDefault(); const userHeight = Number(String(heightInput.value).replace(",", "."));
  if (!Number.isFinite(userHeight) || userHeight < 80 || userHeight > 250) return;
  localStorage.setItem(heightKey, String(userHeight)); heightInput.value = ""; render();
});
byId("clearButton").addEventListener("click", () => { if (confirm("Tüm kilo kayıtları silinsin mi?")) { localStorage.removeItem(key); render(); } });
byId("toggleHistory").addEventListener("click", () => {
  const content = byId("historyContent"); const toggle = byId("toggleHistory");
  const isCollapsed = content.classList.toggle("is-collapsed");
  toggle.textContent = isCollapsed ? "⌄" : "⌃";
  toggle.setAttribute("aria-expanded", String(!isCollapsed));
  toggle.setAttribute("aria-label", isCollapsed ? "Ölçümleri göster" : "Ölçümleri gizle");
});
byId("previousDay").addEventListener("click", () => {
  const selected = dateInput.value ? dateFrom(dateInput.value) : new Date();
  selected.setDate(selected.getDate() - 1);
  dateInput.value = localDate(selected);
});
byId("refreshRecipes").addEventListener("click", showNextMenu);
byId("recipeList").addEventListener("click", (event) => {
  const button = event.target.closest("[data-recipe-id]");
  if (button) toggleFavorite(button.dataset.recipeId);
});
byId("favoritesList").addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-id]");
  if (button) toggleFavorite(button.dataset.removeId);
});
document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.target;
    document.querySelectorAll(".page").forEach((page) => page.classList.toggle("active", page.dataset.page === target));
    document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("active", item === button));
  });
});
render();
renderRecipes();
