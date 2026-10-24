const products=[
{brand:'BMW',model:'320d F30',engine:'2.0d B47',ecu:'Bosch EDC17C50',hw:'0281018475',sw:'1037523456',type:'Stage 1',price:5900,power:'190 → 230 л.с.',torque:'+20%',pop:98},
{brand:'BMW',model:'530d G30',engine:'3.0d B57',ecu:'Bosch MD1CS001',hw:'0281037351',sw:'1039S12345',type:'Stage 1',price:7900,power:'265 → 315 л.с.',torque:'+18%',pop:95},
{brand:'Audi',model:'A4 B9',engine:'2.0 TDI',ecu:'Bosch MD1CP004',hw:'04L907309',sw:'9978',type:'Stage 1',price:6500,power:'190 → 225 л.с.',torque:'+19%',pop:93},
{brand:'Volkswagen',model:'Passat B8',engine:'2.0 TDI CR',ecu:'Bosch EDC17C64',hw:'04L907309R',sw:'9978',type:'DPF Off',price:4500,power:'Stock',torque:'—',pop:91},
{brand:'Mercedes',model:'Sprinter W906',engine:'2.1 CDI OM651',ecu:'Delphi CRD3',hw:'6519020900',sw:'6519036413',type:'EGR Off',price:4500,power:'Stock',torque:'—',pop:88},
{brand:'Toyota',model:'Hilux',engine:'2.8 D-4D',ecu:'Denso GEN3',hw:'89661-0KQ90',sw:'3F0100',type:'Stage 1',price:6500,power:'204 → 235 л.с.',torque:'+15%',pop:87},
{brand:'Skoda',model:'Octavia A7',engine:'1.8 TSI',ecu:'Continental SIMOS 18',hw:'06K907425B',sw:'0002',type:'Stage 1',price:5900,power:'180 → 220 л.с.',torque:'+22%',pop:86},
{brand:'Ford',model:'Transit',engine:'2.0 EcoBlue',ecu:'Continental SID212',hw:'GK2A-12A650',sw:'HAA',type:'AdBlue Off',price:5200,power:'Stock',torque:'—',pop:80},
{brand:'BMW',model:'X5 F15',engine:'3.0d N57',ecu:'Bosch EDC17CP45',hw:'0281019855',sw:'1037530102',type:'Stage 2',price:8900,power:'258 → 330 л.с.',torque:'+27%',pop:83},
{brand:'Audi',model:'Q7 4M',engine:'3.0 TDI',ecu:'Bosch MD1CP004',hw:'4M0907401',sw:'0007',type:'AdBlue Off',price:6900,power:'Stock',torque:'—',pop:79},
{brand:'Volkswagen',model:'Tiguan II',engine:'2.0 TSI',ecu:'Continental SIMOS 18.10',hw:'06K907425D',sw:'0005',type:'Stage 1',price:6200,power:'180 → 225 л.с.',torque:'+20%',pop:82},
{brand:'Mercedes',model:'C220d W205',engine:'2.1 CDI',ecu:'Bosch EDC17C66',hw:'6519041000',sw:'6519032813',type:'Stage 1',price:6400,power:'170 → 205 л.с.',torque:'+19%',pop:84}
];

let state={brand:'',model:'',engine:'',ecu:'',type:'',query:'',sort:'popular',cart:[]};
const $=s=>document.querySelector(s); const $$=s=>[...document.querySelectorAll(s)];

function uniq(arr){return [...new Set(arr)].sort()}
function fillSelect(el,vals,label){const current=el.value;el.innerHTML='<option value="">'+label+'</option>'+vals.map(v=>'<option>'+v+'</option>').join('');if(vals.includes(current))el.value=current}
function syncFilters(){
  fillSelect($('#brandFilter'),uniq(products.map(p=>p.brand)),'Любая марка');
  const scopedBrand=state.brand?products.filter(p=>p.brand===state.brand):products;
  fillSelect($('#modelFilter'),uniq(scopedBrand.map(p=>p.model)),'Любая модель');
  const scopedModel=state.model?scopedBrand.filter(p=>p.model===state.model):scopedBrand;
  fillSelect($('#engineFilter'),uniq(scopedModel.map(p=>p.engine)),'Любой двигатель');
  fillSelect($('#ecuFilter'),uniq(scopedModel.map(p=>p.ecu)),'Любой ЭБУ');
}
function rub(n){return new Intl.NumberFormat('ru-RU').format(n)+' ₽'}
function filtered(){
  let list=products.filter(p=>
    (!state.brand||p.brand===state.brand)&&
    (!state.model||p.model===state.model)&&
    (!state.engine||p.engine===state.engine)&&
    (!state.ecu||p.ecu===state.ecu)&&
    (!state.type||p.type===state.type)
  );
  if(state.query){
    const q=state.query.toLowerCase();
    list=list.filter(p=>Object.values(p).some(v=>String(v).toLowerCase().includes(q)));
  }
  if(state.sort==='cheap')list.sort((a,b)=>a.price-b.price);
  else if(state.sort==='expensive')list.sort((a,b)=>b.price-a.price);
  else list.sort((a,b)=>b.pop-a.pop);
  return list;
}
function render(){
  const list=filtered();
  $('#resultCount').textContent=list.length+' '+(list.length===1?'решение':'решений');
  $('#productGrid').innerHTML=list.map((p,i)=>`
  <article class="product-card">
    <div class="product-image"><span class="product-tag">${p.type}</span></div>
    <div class="product-body">
      <span class="match">● Совместимость по демо-данным</span>
      <h3>${p.brand} ${p.model}</h3>
      <div class="subtitle">${p.engine} • ${p.ecu}</div>
      <div class="specs">
        <span>HW: ${p.hw}</span><span>SW: ${p.sw}</span>
        <span>${p.power}</span><span>Момент: ${p.torque}</span>
      </div>
      <div class="product-bottom">
        <div class="price">${rub(p.price)}</div>
        <button class="buy-btn" data-buy="${products.indexOf(p)}">Купить</button>
      </div>
    </div>
  </article>`).join('') || '<div style="color:#8f9cb0;padding:30px 0">Точных совпадений нет. Можно загрузить оригинальный файл для индивидуального заказа.</div>';
  $$('[data-buy]').forEach(b=>b.onclick=()=>addToCart(products[+b.dataset.buy]));
}
function addToCart(p){state.cart.push(p);updateCart();toast('Добавлено в корзину: '+p.brand+' '+p.model)}
function updateCart(){
  $('#cartCount').textContent=state.cart.length;
  $('#cartItems').innerHTML=state.cart.length?state.cart.map((p,i)=>`<div class="cart-row"><div><b>${p.brand} ${p.model}</b><small>${p.type} • ${p.ecu}</small></div><div><b>${rub(p.price)}</b><button data-remove="${i}">Удалить</button></div></div>`).join(''):'<p style="color:#8796aa">Корзина пока пустая.</p>';
  $('#cartTotal').textContent=rub(state.cart.reduce((s,p)=>s+p.price,0));
  $$('[data-remove]').forEach(b=>b.onclick=()=>{state.cart.splice(+b.dataset.remove,1);updateCart()});
}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(window.tt);window.tt=setTimeout(()=>t.classList.remove('show'),2400)}
function scanAndRender(){
  const s=$('#scanStatus');s.classList.add('active');
  setTimeout(()=>{s.classList.remove('active');render();$('#catalog').scrollIntoView({behavior:'smooth'});toast(filtered().length?'Совместимые решения найдены':'Точного совпадения нет')},900);
}
syncFilters();render();updateCart();

$('#brandFilter').onchange=e=>{state.brand=e.target.value;state.model='';state.engine='';state.ecu='';syncFilters()};
$('#modelFilter').onchange=e=>{state.model=e.target.value;state.engine='';state.ecu='';syncFilters()};
$('#engineFilter').onchange=e=>state.engine=e.target.value;
$('#ecuFilter').onchange=e=>state.ecu=e.target.value;
$('#findBtn').onclick=scanAndRender;
$('#ecuFindBtn').onclick=()=>{state.query=$('#ecuSearch').value.trim();state.type=$('#typeFilter').value;scanAndRender()};
$('#quickSearch').oninput=e=>{state.query=e.target.value.trim();render()};
$('#sortSelect').onchange=e=>{state.sort=e.target.value;render()};
$('#resetFilters').onclick=()=>{state={...state,brand:'',model:'',engine:'',ecu:'',type:'',query:'',sort:'popular'};$('#quickSearch').value='';$('#ecuSearch').value='';$('#typeFilter').value='';syncFilters();render()};

$$('.mode').forEach(b=>b.onclick=()=>{$$('.mode').forEach(x=>x.classList.remove('active'));b.classList.add('active');const car=b.dataset.mode==='car';$('#carFinder').classList.toggle('hidden',!car);$('#ecuFinder').classList.toggle('hidden',car)});
$('#cartBtn').onclick=()=>openModal('cart');
$$('[data-open="login"]').forEach(b=>b.onclick=()=>openModal('login'));
function openModal(name){$('#'+name+'Modal').classList.add('open');document.body.classList.add('modal-open')}
function closeModals(){$$('.modal').forEach(m=>m.classList.remove('open'));document.body.classList.remove('modal-open')}
$$('[data-close]').forEach(b=>b.onclick=closeModals);$$('.modal').forEach(m=>m.onclick=e=>{if(e.target===m)closeModals()});
$('#checkoutDemo').onclick=()=>{if(!state.cart.length)return toast('Добавьте хотя бы одну калибровку');toast('Демо оплаты: здесь откроется WooCommerce Checkout')};
$('#demoLogin').onclick=()=>{closeModals();$('#account').scrollIntoView({behavior:'smooth'});toast('Выполнен демо-вход')};
$('.download-demo').onclick=()=>toast('В рабочей версии начнётся защищённое скачивание');
const dz=$('#dropzone'),fi=$('#fileInput');dz.onclick=()=>fi.click();fi.onchange=()=>{if(fi.files[0]){dz.querySelector('b').textContent=fi.files[0].name;dz.querySelector('span').textContent=(fi.files[0].size/1024/1024).toFixed(2)+' MB • готов к созданию заказа';toast('Файл выбран. В демо загрузка отключена.')}};
['dragenter','dragover'].forEach(ev=>dz.addEventListener(ev,e=>{e.preventDefault();dz.classList.add('drag')}));['dragleave','drop'].forEach(ev=>dz.addEventListener(ev,e=>{e.preventDefault();dz.classList.remove('drag')}));dz.addEventListener('drop',e=>{const f=e.dataTransfer.files[0];if(f){dz.querySelector('b').textContent=f.name;dz.querySelector('span').textContent=(f.size/1024/1024).toFixed(2)+' MB • готов к созданию заказа';toast('Файл выбран. В демо загрузка отключена.')}});
$('#menuToggle').onclick=()=>$('#mainNav').classList.toggle('open');
