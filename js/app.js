const KEY="winwin_data_v1";
const CEDI=new Intl.NumberFormat("en-GH",{style:"currency",currency:"GHS",maximumFractionDigits:2});
const money=n=>CEDI.format(Number(n)||0).replace("GHS","GH₵");
const uid=p=>p+"-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,6);
const defaultData={
 settings:{businessName:"Win Win",tagline:"Together we grow",phone:"",address:"",currency:"GHS"},
 products:[
  {id:"p1",name:"Cement 42.5R",sku:"CEM-425",unit:"Bag",stock:100,price:95,cost:82,min:20},
  {id:"p2",name:"Cement 32.5R",sku:"CEM-325",unit:"Bag",stock:80,price:88,cost:76,min:20},
  {id:"p3",name:"12mm Iron Rod",sku:"ROD-12",unit:"Piece",stock:250,price:120,cost:105,min:40},
  {id:"p4",name:"Binding Wire",sku:"BW-01",unit:"Roll",stock:35,price:35,cost:28,min:8},
  {id:"p5",name:"Sharp Sand",sku:"SAND-S",unit:"Trip",stock:15,price:800,cost:650,min:3}
 ],
 customers:[{id:"c1",name:"Walk-in Customer",phone:"",address:"",credit:0},{id:"c2",name:"ABC Construction Ltd",phone:"0240000000",address:"Kumasi",credit:0}],
 sales:[], invoices:[], receipts:[], purchases:[], quotations:[], payments:[], deliveries:[], expenses:[], staff:[]
};
let data=JSON.parse(localStorage.getItem(KEY)||"null")||structuredClone(defaultData);
function save(){localStorage.setItem(KEY,JSON.stringify(data));}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
function toast(t){const x=document.getElementById("toast");x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),2200);}
const content=document.getElementById("content"), title=document.getElementById("pageTitle"), subtitle=document.getElementById("pageSubtitle");
const titles={dashboard:["Dashboard","Your building-material business at a glance"],sales:["New Sale","Record a customer sale"],invoices:["Invoices","Create and manage customer invoices"],receipts:["Receipts","Sales receipts and payment records"],customers:["Customers","Customer accounts and balances"],products:["Products & Stock","Inventory, prices and stock levels"],purchases:["Purchases","Stock purchased from suppliers"],quotations:["Quotations","Prepare and manage customer quotations"],payments:["Payments","Money received from customers"],deliveries:["Deliveries","Delivery notes and partial deliveries"],expenses:["Expenses","Track business expenses"],reports:["Reports","Sales, profit, stock and customer reports"],staff:["Staff","Manage staff access"],settings:["Settings","Business information and data controls"]};

function setView(v){location.hash=v;document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.view===v));title.textContent=titles[v][0];subtitle.textContent=titles[v][1];render(v);document.getElementById("sidebar").classList.remove("open");}
function render(v){({dashboard:dashboard,sales:sales,invoices:invoices,receipts:receipts,customers:customers,products:products,purchases:purchases,quotations:quotations,payments:payments,deliveries:deliveries,expenses:expenses,reports:reports,staff:staff,settings:settings}[v]||dashboard)();}
function card(label,value,small=""){return `<div class="stat"><div class="label">${label}</div><div class="value">${value}</div><small>${small}</small></div>`}
function dashboard(){
 const low=data.products.filter(p=>p.stock<=p.min).length;
 const overdue=data.invoices.filter(i=>i.status==="Unpaid"||i.status==="Part-paid").length;
 content.innerHTML=`<div class="hero"><div><h2>Welcome to Win Win</h2><p>Together we grow — run your building-material business with confidence.</p></div><img src="icons/win-win-logo.png"></div>
 <div class="quick-grid">
 ${quick("＋","New Sale","Record a counter sale","sales")}${quick("▤","Invoice","Create a separate invoice","invoices")}${quick("♙","Customer","Open customer accounts","customers")}${quick("▦","Stock","Check products and stock","products")}${quick("↙","Purchase","Record stock purchases","purchases")}${quick("▤","Quotation","Prepare a quotation","quotations")}${quick("₵","Payment","Record customer payment","payments")}${quick("▣","Delivery","Create delivery note","deliveries")}
 </div>
 <div class="section-title"><h3>Attention</h3></div>
 <div class="cards">${card("Low-stock items",low,low?"Need attention":"Stock levels healthy")}${card("Open invoices",overdue,overdue?"Review balances":"No open invoices")}${card("Products",data.products.length,"Items in catalogue")}${card("Customers",data.customers.length,"Customer accounts")}</div>`;
 document.querySelectorAll(".quick").forEach(b=>b.onclick=()=>setView(b.dataset.view));
}
function quick(icon,name,desc,view){return `<button class="quick" data-view="${view}"><b>${icon} ${name}</b><span>${desc}</span></button>`}
function toolbar(btn,label,search=false){return `<div class="page-actions">${search?'<input id="pageSearch" class="search" placeholder="Search...">':""}<button class="primary" id="${btn}">＋ ${label}</button></div>`}

function sales(){
 content.innerHTML=`<div class="section-title"><h3>Quick counter sale</h3>${toolbar("newSaleBtn","New Sale")}</div>
 <div class="table-wrap">${data.sales.length?`<table class="table"><thead><tr><th>Sale</th><th>Customer</th><th>Date</th><th>Total</th><th>Payment</th></tr></thead><tbody>${data.sales.slice().reverse().map(s=>`<tr><td>${esc(s.id)}</td><td>${esc(s.customer)}</td><td>${esc(s.date)}</td><td>${money(s.total)}</td><td><span class="badge green">${esc(s.payment)}</span></td></tr>`).join("")}</tbody></table>`:`<div class="empty">No sales recorded yet.<br><br><button class="primary" onclick="openSale()">Create your first sale</button></div>`}</div>`;
 document.getElementById("newSaleBtn").onclick=openSale;
}
function productOptions(){return data.products.map(p=>`<option value="${p.id}">${esc(p.name)} — ${money(p.price)}/${esc(p.unit)} (stock ${p.stock})</option>`).join("")}
function openSale(){
 showModal("New Sale",`<div class="form-grid">
 <div class="form-group"><label>Customer</label><select id="saleCustomer">${data.customers.map(c=>`<option>${esc(c.name)}</option>`).join("")}</select></div>
 <div class="form-group"><label>Payment method</label><select id="salePayment"><option>Cash</option><option>Mobile Money</option><option>Bank</option><option>Card</option><option>Credit</option><option>Split payment</option></select></div>
 </div><div style="margin:18px 0 8px;font-size:12px;color:#687487">Items</div>
 <div id="saleLines" class="sale-lines"></div><button class="secondary" id="addLine">＋ Add item</button>
 <div class="totals"><div class="total-row"><span>Subtotal</span><b id="saleTotal">GH₵0.00</b></div></div>
 <div class="modal-foot"><button class="secondary" onclick="closeModal()">Cancel</button><button class="primary" id="saveSale">Complete Sale</button></div>`);
 addSaleLine();document.getElementById("addLine").onclick=()=>addSaleLine();
 document.getElementById("saveSale").onclick=saveSale;
}
function addSaleLine(){
 const wrap=document.getElementById("saleLines"), row=document.createElement("div");row.className="sale-line";
 row.innerHTML=`<select>${productOptions()}</select><input type="number" min="1" value="1"><input type="number" min="0" step=".01" value="${data.products[0]?.price||0}"><b>GH₵0.00</b><button class="danger">×</button>`;
 wrap.appendChild(row);
 const recalc=()=>{const p=data.products.find(x=>x.id===row.children[0].value);row.children[2].value=p?p.price:0;calcSale()};
 row.children[0].onchange=recalc;row.children[1].oninput=calcSale;row.children[2].oninput=calcSale;row.children[4].onclick=()=>{row.remove();calcSale()};calcSale();
}
function calcSale(){let total=0;document.querySelectorAll(".sale-line").forEach(r=>{const q=Number(r.children[1].value)||0,p=Number(r.children[2].value)||0;const a=q*p;total+=a;r.children[3].textContent=money(a)});const x=document.getElementById("saleTotal");if(x)x.textContent=money(total)}
function saveSale(){
 const rows=[...document.querySelectorAll(".sale-line")];let items=[],total=0;
 for(const r of rows){const p=data.products.find(x=>x.id===r.children[0].value),q=Number(r.children[1].value),price=Number(r.children[2].value);if(!p||q<=0)continue;if(q>p.stock){toast(`Not enough stock for ${p.name}`);return}items.push({productId:p.id,name:p.name,qty:q,unit:p.unit,price,amount:q*price});total+=q*price}
 if(!items.length){toast("Add at least one item");return}
 items.forEach(i=>data.products.find(p=>p.id===i.productId).stock-=i.qty);
 const sale={id:uid("SAL"),customer:document.getElementById("saleCustomer").value,date:new Date().toLocaleString(),total,payment:document.getElementById("salePayment").value,items};
 data.sales.push(sale);data.receipts.push({id:uid("REC"),saleId:sale.id,customer:sale.customer,date:sale.date,amount:total,payment:sale.payment});
 save();closeModal();toast("Sale recorded and stock updated");sales();
}

function invoices(){
 content.innerHTML=`<div class="section-title"><h3>Customer invoices</h3>${toolbar("newInvoiceBtn","Create Invoice")}</div>
 <div class="table-wrap">${data.invoices.length?`<table class="table"><thead><tr><th>Invoice</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th><th></th></tr></thead><tbody>${data.invoices.slice().reverse().map(i=>`<tr><td>${i.id}</td><td>${esc(i.customer)}</td><td>${esc(i.date)}</td><td>${money(i.total)}</td><td><span class="badge ${i.status==="Paid"?"green":i.status==="Overdue"?"red":"orange"}">${i.status}</span></td><td><button class="secondary" onclick="printDoc('invoice','${i.id}')">Print</button></td></tr>`).join("")}</tbody></table>`:`<div class="empty">No invoices yet. Invoices are intentionally separate from counter sales.</div>`}</div>`;
 document.getElementById("newInvoiceBtn").onclick=openInvoice;
}
function openInvoice(){
 showModal("Create Invoice",`<div class="form-grid"><div class="form-group"><label>Customer</label><select id="invCustomer">${data.customers.map(c=>`<option>${esc(c.name)}</option>`).join("")}</select></div><div class="form-group"><label>Status</label><select id="invStatus"><option>Unpaid</option><option>Part-paid</option><option>Paid</option></select></div></div><div style="margin:18px 0 8px;font-size:12px;color:#687487">Invoice items</div><div id="invLines" class="sale-lines"></div><button class="secondary" id="addInvLine">＋ Add item</button><div class="totals"><div class="total-row"><span>Grand Total</span><b id="invTotal">GH₵0.00</b></div></div><div class="modal-foot"><button class="secondary" onclick="closeModal()">Cancel</button><button class="primary" id="saveInvoice">Save Invoice</button></div>`);
 addInvLine();document.getElementById("addInvLine").onclick=addInvLine;document.getElementById("saveInvoice").onclick=saveInvoice;
}
function addInvLine(){const w=document.getElementById("invLines"),r=document.createElement("div");r.className="sale-line";r.innerHTML=`<select>${productOptions()}</select><input type="number" min="1" value="1"><input type="number" min="0" step=".01" value="${data.products[0]?.price||0}"><b>GH₵0.00</b><button class="danger">×</button>`;w.appendChild(r);r.children[0].onchange=()=>{const p=data.products.find(x=>x.id===r.children[0].value);r.children[2].value=p?.price||0;calcInv()};r.children[1].oninput=calcInv;r.children[2].oninput=calcInv;r.children[4].onclick=()=>{r.remove();calcInv()};calcInv()}
function calcInv(){let t=0;document.querySelectorAll("#invLines .sale-line").forEach(r=>{const a=(+r.children[1].value||0)*(+r.children[2].value||0);t+=a;r.children[3].textContent=money(a)});const x=document.getElementById("invTotal");if(x)x.textContent=money(t)}
function saveInvoice(){const rows=[...document.querySelectorAll("#invLines .sale-line")],items=[];let total=0;rows.forEach(r=>{const p=data.products.find(x=>x.id===r.children[0].value),q=+r.children[1].value,price=+r.children[2].value;if(p&&q>0){items.push({productId:p.id,name:p.name,qty:q,unit:p.unit,price,amount:q*price});total+=q*price}});if(!items.length){toast("Add at least one item");return}const i={id:uid("INV"),customer:document.getElementById("invCustomer").value,date:new Date().toLocaleString(),total,status:document.getElementById("invStatus").value,items};data.invoices.push(i);save();closeModal();toast("Invoice created");invoices()}

function receipts(){content.innerHTML=`<div class="section-title"><h3>Receipts</h3></div><div class="table-wrap">${data.receipts.length?`<table class="table"><thead><tr><th>Receipt</th><th>Customer</th><th>Date</th><th>Amount</th><th>Method</th><th></th></tr></thead><tbody>${data.receipts.slice().reverse().map(r=>`<tr><td>${r.id}</td><td>${esc(r.customer)}</td><td>${esc(r.date)}</td><td>${money(r.amount)}</td><td>${esc(r.payment)}</td><td><button class="secondary" onclick="printDoc('receipt','${r.id}')">Print</button></td></tr>`).join("")}</tbody></table>`:`<div class="empty">Receipts will appear here after sales or recorded payments.</div>`}</div>`}
function customers(){content.innerHTML=`<div class="section-title"><h3>Customers</h3>${toolbar("newCustomerBtn","Customer")}</div><div class="table-wrap"><table class="table"><thead><tr><th>Customer</th><th>Phone</th><th>Address</th><th>Balance</th></tr></thead><tbody>${data.customers.map(c=>{const bal=data.invoices.filter(i=>i.customer===c.name&&i.status!=="Paid").reduce((s,i)=>s+i.total,0)-data.payments.filter(p=>p.customer===c.name).reduce((s,p)=>s+p.amount,0);return `<tr><td><b>${esc(c.name)}</b></td><td>${esc(c.phone)}</td><td>${esc(c.address)}</td><td>${money(Math.max(0,bal))}</td></tr>`}).join("")}</tbody></table></div>`;document.getElementById("newCustomerBtn").onclick=()=>showModal("Add Customer",`<div class="form-grid"><div class="form-group"><label>Name</label><input id="cName"></div><div class="form-group"><label>Phone</label><input id="cPhone"></div><div class="form-group full"><label>Address</label><input id="cAddress"></div></div><div class="modal-foot"><button class="secondary" onclick="closeModal()">Cancel</button><button class="primary" onclick="addCustomer()">Save Customer</button></div>`)}
function addCustomer(){const n=document.getElementById("cName").value.trim();if(!n){toast("Enter customer name");return}data.customers.push({id:uid("CUS"),name:n,phone:document.getElementById("cPhone").value,address:document.getElementById("cAddress").value,credit:0});save();closeModal();customers();toast("Customer added")}

function products(){content.innerHTML=`<div class="section-title"><h3>Products & Stock</h3>${toolbar("newProductBtn","Product",true)}</div><div class="table-wrap"><table class="table"><thead><tr><th>Product</th><th>SKU</th><th>Unit</th><th>Stock</th><th>Selling</th><th>Cost</th><th>Status</th></tr></thead><tbody id="productRows">${data.products.map(p=>`<tr><td><b>${esc(p.name)}</b></td><td>${esc(p.sku)}</td><td>${esc(p.unit)}</td><td>${p.stock}</td><td>${money(p.price)}</td><td>${money(p.cost)}</td><td>${p.stock<=p.min?'<span class="badge red">Low stock</span>':'<span class="badge green">Healthy</span>'}</td></tr>`).join("")}</tbody></table></div>`;document.getElementById("newProductBtn").onclick=()=>showModal("Add Product",`<div class="form-grid"><div class="form-group"><label>Product name</label><input id="pName"></div><div class="form-group"><label>SKU</label><input id="pSku"></div><div class="form-group"><label>Unit</label><input id="pUnit" placeholder="Bag, Piece, Trip, Roll..."></div><div class="form-group"><label>Opening stock</label><input id="pStock" type="number" min="0"></div><div class="form-group"><label>Selling price</label><input id="pPrice" type="number" step=".01"></div><div class="form-group"><label>Cost price</label><input id="pCost" type="number" step=".01"></div><div class="form-group"><label>Minimum stock</label><input id="pMin" type="number" min="0"></div></div><div class="modal-foot"><button class="secondary" onclick="closeModal()">Cancel</button><button class="primary" onclick="addProduct()">Save Product</button></div>`)}
function addProduct(){const n=document.getElementById("pName").value.trim();if(!n){toast("Enter product name");return}data.products.push({id:uid("PRO"),name:n,sku:document.getElementById("pSku").value,unit:document.getElementById("pUnit").value||"Unit",stock:+document.getElementById("pStock").value||0,price:+document.getElementById("pPrice").value||0,cost:+document.getElementById("pCost").value||0,min:+document.getElementById("pMin").value||0});save();closeModal();products();toast("Product added")}

function simpleList(type,label,fields=[]){content.innerHTML=`<div class="section-title"><h3>${label}</h3>${toolbar("newBtn",label.slice(0,-1)||label)}</div><div class="table-wrap"><div class="empty">${data[type].length?`There are ${data[type].length} recorded ${label.toLowerCase()}.`:"No records yet."}</div></div>`;document.getElementById("newBtn").onclick=()=>toast("This module is ready for the next workflow layer.");}
function purchases(){simpleList("purchases","Purchases")}
function quotations(){content.innerHTML=`<div class="section-title"><h3>Quotations</h3>${toolbar("newQuoteBtn","Quotation")}</div><div class="table-wrap">${data.quotations.length?`<table class="table"><thead><tr><th>Quotation</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th></tr></thead><tbody>${data.quotations.map(q=>`<tr><td>${q.id}</td><td>${esc(q.customer)}</td><td>${q.date}</td><td>${money(q.total)}</td><td>${q.status}</td></tr>`).join("")}</tbody></table>`:`<div class="empty">No quotations yet. Use this area for customer pricing before converting accepted quotes to invoices.</div>`}</div>`;document.getElementById("newQuoteBtn").onclick=()=>toast("Quotation builder is reserved for the next workflow layer.")}
function payments(){content.innerHTML=`<div class="section-title"><h3>Payments received</h3>${toolbar("newPayBtn","Payment")}</div><div class="table-wrap">${data.payments.length?`<table class="table"><thead><tr><th>Payment</th><th>Customer</th><th>Date</th><th>Amount</th><th>Method</th></tr></thead><tbody>${data.payments.map(p=>`<tr><td>${p.id}</td><td>${esc(p.customer)}</td><td>${p.date}</td><td>${money(p.amount)}</td><td>${p.method}</td></tr>`).join("")}</tbody></table>`:`<div class="empty">No customer payments recorded yet.</div>`}</div>`;document.getElementById("newPayBtn").onclick=()=>showModal("Record Payment",`<div class="form-grid"><div class="form-group"><label>Customer</label><select id="payCustomer">${data.customers.map(c=>`<option>${esc(c.name)}</option>`).join("")}</select></div><div class="form-group"><label>Amount</label><input id="payAmount" type="number" step=".01"></div><div class="form-group"><label>Method</label><select id="payMethod"><option>Cash</option><option>Mobile Money</option><option>Bank</option><option>Card</option></select></div></div><div class="modal-foot"><button class="secondary" onclick="closeModal()">Cancel</button><button class="primary" onclick="addPayment()">Save Payment</button></div>`)}
function addPayment(){const a=+document.getElementById("payAmount").value;if(a<=0){toast("Enter a valid amount");return}data.payments.push({id:uid("PAY"),customer:document.getElementById("payCustomer").value,date:new Date().toLocaleString(),amount:a,method:document.getElementById("payMethod").value});save();closeModal();payments();toast("Payment recorded")}
function deliveries(){simpleList("deliveries","Deliveries")}
function expenses(){simpleList("expenses","Expenses")}
function reports(){const sales=data.sales.reduce((s,x)=>s+x.total,0),expenses=data.expenses.reduce((s,x)=>s+(+x.amount||0),0),stockValue=data.products.reduce((s,p)=>s+p.stock*p.cost,0);content.innerHTML=`<div class="cards">${card("Sales",money(sales),"All recorded sales")}${card("Expenses",money(expenses),"Recorded expenses")}${card("Gross margin",money(data.sales.reduce((s,x)=>s+x.items.reduce((a,i)=>a+i.qty*(i.price-(data.products.find(p=>p.id===i.productId)?.cost||0)),0),0)),"Based on product cost")}${card("Stock value",money(stockValue),"Current stock at cost")}</div><div class="section-title"><h3>Report menus</h3></div><div class="quick-grid">${quick("▥","Sales Reports","Daily, weekly, monthly and custom","reports")}${quick("▦","Stock Reports","Low stock and valuation","reports")}${quick("♙","Customer Reports","Balances and statements","customers")}${quick("₵","Payment Reports","Money received","payments")}</div><p style="color:#6d7888;font-size:12px">Sales figures are intentionally kept inside Reports rather than displayed on the main dashboard.</p>`}
function staff(){simpleList("staff","Staff")}
function settings(){content.innerHTML=`<div class="section-title"><h3>Business settings</h3></div><div class="table-wrap" style="padding:20px"><div class="form-grid"><div class="form-group"><label>Business name</label><input id="setName" value="${esc(data.settings.businessName)}"></div><div class="form-group"><label>Tagline</label><input id="setTag" value="${esc(data.settings.tagline)}"></div><div class="form-group"><label>Phone</label><input id="setPhone" value="${esc(data.settings.phone)}"></div><div class="form-group"><label>Address</label><input id="setAddress" value="${esc(data.settings.address)}"></div></div><div class="modal-foot"><button class="primary" onclick="saveSettings()">Save Settings</button><button class="danger" onclick="resetDemo()">Reset Demo Data</button></div></div>`}
function saveSettings(){data.settings.businessName=document.getElementById("setName").value||"Win Win";data.settings.tagline=document.getElementById("setTag").value||"Together we grow";data.settings.phone=document.getElementById("setPhone").value;data.settings.address=document.getElementById("setAddress").value;save();toast("Settings saved")}
function resetDemo(){if(confirm("Reset all local app data to the starter demo?")){data=structuredClone(defaultData);save();setView("dashboard");toast("Demo data reset")}}

function showModal(t,b){document.getElementById("modalTitle").textContent=t;document.getElementById("modalBody").innerHTML=b;document.getElementById("modal").classList.remove("hidden")}
function closeModal(){document.getElementById("modal").classList.add("hidden")}
document.getElementById("modalClose").onclick=closeModal;
document.getElementById("modal").onclick=e=>{if(e.target.id==="modal")closeModal()};
function printDoc(type,id){
 let d=type==="invoice"?data.invoices.find(x=>x.id===id):data.receipts.find(x=>x.id===id);if(!d)return;
 const rows=d.items?d.items.map(i=>`<tr><td>${esc(i.name)}</td><td>${i.qty}</td><td>${esc(i.unit)}</td><td>${money(i.price)}</td><td>${money(i.amount)}</td></tr>`).join(""):`<tr><td>Payment</td><td>1</td><td>Payment</td><td>${money(d.amount)}</td><td>${money(d.amount)}</td></tr>`;
 const w=window.open("","_blank");w.document.write(`<html><head><title>${d.id}</title><style>body{font-family:Arial;padding:35px;color:#152235}header{display:flex;align-items:center;gap:15px;border-bottom:2px solid #152235;padding-bottom:15px}img{width:80px;height:80px;object-fit:cover;border-radius:10px}h1{margin:0}table{width:100%;border-collapse:collapse;margin-top:25px}th,td{padding:10px;border-bottom:1px solid #ddd;text-align:left}.total{text-align:right;font-size:20px;font-weight:bold;margin-top:20px}</style></head><body><header><img src="${location.href.split("index.html")[0]}icons/win-win-logo.png"><div><h1>${type==="invoice"?"INVOICE":"RECEIPT"}</h1><div>Win Win — Together we grow</div></div></header><p><b>${type==="invoice"?"Invoice":"Receipt"}:</b> ${d.id}<br><b>Customer:</b> ${esc(d.customer)}<br><b>Date:</b> ${esc(d.date)}</p><table><thead><tr><th>Item</th><th>Qty</th><th>Unit</th><th>Price</th><th>Amount</th></tr></thead><tbody>${rows}</tbody></table><div class="total">Total: ${money(d.total||d.amount)}</div><script>window.print()<\/script></body></html>`);w.document.close();
}
document.querySelectorAll(".nav-item").forEach(b=>b.onclick=()=>setView(b.dataset.view));
document.getElementById("quickSale").onclick=openSale;
document.getElementById("menuBtn").onclick=()=>document.getElementById("sidebar").classList.toggle("open");
window.addEventListener("hashchange",()=>setView(location.hash.slice(1)||"dashboard"));
if("serviceWorker" in navigator)navigator.serviceWorker.register("service-worker.js").catch(()=>{});
setView(location.hash.slice(1)||"dashboard");
