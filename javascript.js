let userId = null

function registrar(){

let email = prompt("Correo")
let pass = prompt("Contraseña")

fetch("registro.php", {
method:"POST",
headers:{'Content-Type':'application/x-www-form-urlencoded'},
body:`email=${email}&pass=${pass}`
})
.then(r=>r.text())
.then(r=>alert(r))

}

function login(){

let email = prompt("Correo")
let pass = prompt("Contraseña")

fetch("login.php", {
method:"POST",
headers:{'Content-Type':'application/x-www-form-urlencoded'},
body:`email=${email}&pass=${pass}`
})
.then(r=>r.text())
.then(r=>{

if(r!="error"){
let data = JSON.parse(r)

userId = data.id
ortos = parseFloat(data.ortos)
deuda = parseFloat(data.deuda)
casas = parseInt(data.casas)

actualizar()
alert("Bienvenido")
}else{
alert("Error")
}

})

}

setInterval(()=>{

if(userId==null) return

fetch("guardar.php", {
method:"POST",
headers:{'Content-Type':'application/x-www-form-urlencoded'},
body:`id=${userId}&ortos=${ortos}&deuda=${deuda}&casas=${casas}`
})

},5000)

















let ortos=0
let deuda=0
let bancoDeuda=0

let casas=0
let precioCasa=50

let nivelBanco=1
let tiempoPrestamo=0

let enCarcel=false
let anosCarcel=500


let empresasAcciones=[
{nombre:"TechNova",precio:20,propiedad:0},
{nombre:"CasaCorp",precio:15,propiedad:0},
{nombre:"BancoMax",precio:25,propiedad:0},
{nombre:"AgroPlus",precio:10,propiedad:0}
]

/* ======= EMPRESA (AÑADIDO) ======= */

let empresaCreada=false
let empleados=[]
let estadoEmpresa="normal"
let culpableIndex=null

/* UI */

function actualizar(){
document.getElementById("ortos").innerText=ortos.toFixed(2)
document.getElementById("deuda").innerText=deuda.toFixed(2)
document.getElementById("deudaBanco").innerText=bancoDeuda.toFixed(2)
document.getElementById("casas").innerText=casas
document.getElementById("nivelBanco").innerText=nivelBanco
document.getElementById("precioCasa").innerText=precioCasa.toFixed(2)
}

/* TRABAJO (igual) */

function aplicarTrabajo(){
if(enCarcel) return

let o=prompt("Ortos")
let d=prompt("Deuda")
let t=prompt("Casas")



if(o==ortos && d==deuda && t==casas){
document.getElementById("trabajarBtn").style.display="inline"
}else{
alert("Mentiste")
}
}

function trabajar(){
if(enCarcel) return
ortos+=5
actualizar()
}

/* ILEGAL (igual) */

function menuIlegal(){
document.getElementById("menuIlegal").innerHTML=`
<button onclick="ilegal(40,0.2)">Contrabando</button>
<button onclick="ilegal(120,0.35)">Fraude</button>
<button onclick="ilegal(400,0.6)">Gran robo</button>
`
}

function ilegal(ganancia,riesgo){
if(enCarcel) return

if(Math.random()<riesgo){
alert("🚔 Arrestado")
irCarcel()
return
prejuicio =true

}

ortos+=ganancia
actualizar()
}

/* CARCEL (igual) */

function irCarcel(){
enCarcel=true
anosCarcel=500
document.getElementById("carcel").style.display="flex"
document.getElementById("anos").innerText=anosCarcel
}

function esperar(){

if(!enCarcel) return

anosCarcel-=10


if(Math.random()<0.1){
alert("⚠️ Problema en prisión: +40 años")
anosCarcel+=40

}

if(anosCarcel<=0){
salirCarcel()
}

document.getElementById("anos").innerText=anosCarcel

}

function corrupcion(){
if(!enCarcel) return

if(ortos>=500){
ortos-=500
salirCarcel()
}else{
alert("No tienes suficiente dinero")
}

actualizar()
}


function escape(){

if(Math.random()<0.5){

    alert("moriste")
    window.location.href = "https://es.wikipedia.org/wiki/Diarrea";


}else{

alert("escapaste")
enCarcel=false
document.getElementById("carcel").style.display="none"
}

actualizar()
}

function salirCarcel(){
enCarcel=false
document.getElementById("carcel").style.display="none"
}

/* GOTA (igual) */

function gota(){
if(enCarcel) return

let cantidad=Number(document.getElementById("prestamo").value)

ortos+=cantidad
deuda+=cantidad

actualizar()
}

function pagarGota(){
if(ortos>=deuda){
ortos-=deuda
deuda=0
}
actualizar()
}

setInterval(()=>{ if(deuda>0){ deuda*=1.01 } },1000)

/* BANCO (igual) */

function prestamoBanco(){
if(enCarcel) return

let prestamos=[50,120,300,700]
let intereses=[1.05,1.04,1.03,1.02]

if(bancoDeuda>0) return

let cantidad=prestamos[nivelBanco-1]

ortos+=cantidad
bancoDeuda=cantidad*intereses[nivelBanco-1]

tiempoPrestamo=Date.now()

actualizar()
}

function pagarBanco(){
if(ortos>=bancoDeuda){

ortos-=bancoDeuda

if(Date.now()-tiempoPrestamo<60000 && nivelBanco<4){
nivelBanco++
}

bancoDeuda=0
}

actualizar()
}

/* CASAS (igual corregido) */

function comprarCasa(){
if(enCarcel) return

if(ortos>=precioCasa){
ortos-=precioCasa
casas++
precioCasa*=1.1
}

actualizar()
}

function venderCasa(){
if(casas<=0) return

casas--
precioCasa/=1.1
ortos+=precioCasa*0.8

actualizar()
}

/* ======= EMPRESA COMPLETA ======= */

function crearEmpresa(){
if(empresaCreada){
alert("Ya tienes empresa")
return
}

if(ortos<200 || deuda>100){
alert("Estado rechazó tu empresa")
return
}

empresaCreada=true
ortos-=200

renderEmpresa()
actualizar()
}

function renderEmpresa(){

let estadoTexto = estadoEmpresa=="normal" ? "🟢 Normal" : "🔴 Corrupción"

let html=`
<div>Estado: ${estadoTexto}</div>
<button onclick="contratarEmpleado()">Contratar empleado (200)</button>
<div id="listaEmpleados"></div>
`

if(estadoEmpresa=="corrupcion"){
html+=`<button onclick="acusar()">Acusar</button>`
}

document.getElementById("empresa").innerHTML=html
mostrarEmpleados()
}

function contratarEmpleado(){
if(ortos<200){
alert("No tienes dinero")
return
}

ortos-=200
let nivel=Math.floor(Math.random()*100)+1
empleados.push({nivel})

mostrarEmpleados()
actualizar()
}

function mostrarEmpleados(){
let html=""

empleados.forEach((e,i)=>{
html+=`
<div class="empleado">
Empleado ${i+1} | Nivel: ${e.nivel}
<br>
<button onclick="despedirEmpleado(${i})">Despedir</button>
</div>`
})

document.getElementById("listaEmpleados").innerHTML=html
}

function despedirEmpleado(i){

if(estadoEmpresa!="corrupcion"){
if(ortos<150){
alert("Cuesta 150")
return
}
ortos-=150
}

empleados.splice(i,1)
mostrarEmpleados()
actualizar()
}

/* CORRUPCIÓN EMPRESA */

setInterval(()=>{
if(!empresaCreada || empleados.length==0) return

let posibles=empleados.map((e,i)=>({e,i})).filter(x=>x.e.nivel<=80)

if(posibles.length==0) return

if(Math.random()<0.3){
let elegido=posibles[Math.floor(Math.random()*posibles.length)]
culpableIndex=elegido.i
estadoEmpresa="corrupcion"
renderEmpresa()
}
},8000)

/* ACUSAR */

function acusar(){

let html="<h4>Interrogatorio</h4>"

empleados.forEach((e,i)=>{
let texto = (i==culpableIndex) ? "No fui yo..." : "Soy inocente"

html+=`
<div class="empleado">
Empleado ${i+1}: "${texto}"
<br>
<button onclick="elegirCulpable(${i})">Acusar</button>
</div>`
})

document.getElementById("interrogatorio").innerHTML=html
}

function elegirCulpable(i){

if(i==culpableIndex){
alert("Atrapaste al culpable")
empleados.splice(i,1)
}else{
alert("Fallaste (-300)")
ortos-=300
}

culpableIndex=null
estadoEmpresa="normal"

document.getElementById("interrogatorio").innerHTML=""
renderEmpresa()
actualizar()
}

/* ACCIONES (igual) */

function mostrarAcciones(){
let html=""

empresasAcciones.forEach((e,i)=>{
html+=`
<div class="empleado">
${e.nombre} | Precio: ${e.precio.toFixed(2)} | Tu propiedad: ${e.propiedad}%
<br>
<button onclick="comprarAccion(${i})">Comprar 10%</button>
</div>
`
})

document.getElementById("acciones").innerHTML=html
}

function comprarAccion(i){

let empresa=empresasAcciones[i]
let costo=empresa.precio*10

if(ortos<costo){
alert("No tienes ortos")
return
}

ortos-=costo
empresa.propiedad+=10

mostrarAcciones()
actualizar()
}

/* MERCADO (igual) */

setInterval(()=>{
empresasAcciones.forEach(e=>{
let cambio=(Math.random()*6)-3
e.precio+=cambio
if(e.precio<1) e.precio=1
})
mostrarAcciones()
},6000)

setInterval(()=>{
let e=empresasAcciones[Math.floor(Math.random()*empresasAcciones.length)]
let r=Math.random()

if(r<0.4){
e.precio*=1.5
document.getElementById("eventoBar").innerText="📈 Éxito en "+e.nombre
}
else if(r<0.8){
e.precio*=0.6
document.getElementById("eventoBar").innerText="📉 Problemas en "+e.nombre
}
else{
document.getElementById("eventoBar").innerText="💥 QUIEBRA empresarial"
empresasAcciones.forEach(emp=>emp.propiedad=0)

}

setTimeout(()=>{
document.getElementById("eventoBar").innerText="Economía estable"
},15000)

mostrarAcciones()
actualizar()

},20000)

mostrarAcciones()
actualizar()

