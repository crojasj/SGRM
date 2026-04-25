// ============================================
// SGRM PRO - SISTEMA DE AUTENTICACIÓN COMPLETO
// ============================================

// ========== VALIDACIÓN DE RUT CHILENO ==========
function validarRut(rut) {
    if (!rut) return false;
    
    // Limpiar RUT (eliminar puntos y guión)
    let rutLimpio = rut.replace(/\./g, '').replace(/-/g, '');
    
    // Separar cuerpo y dígito verificador
    let cuerpo = rutLimpio.slice(0, -1);
    let dv = rutLimpio.slice(-1).toUpperCase();
    
    if (cuerpo.length < 2) return false;
    if (isNaN(parseInt(cuerpo))) return false;
    
    // Calcular dígito verificador
    let suma = 0;
    let multiplo = 2;
    
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo.charAt(i)) * multiplo;
        multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }
    
    const dvEsperado = 11 - (suma % 11);
    const dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();
    
    return dv === dvCalculado;
}

// ========== FORMATEAR RUT ==========
function formatearRut(rut) {
    let rutLimpio = rut.replace(/\./g, '').replace(/-/g, '');
    let cuerpo = rutLimpio.slice(0, -1);
    let dv = rutLimpio.slice(-1).toUpperCase();
    
    // Formatear con puntos y guión
    let formateado = '';
    for (let i = cuerpo.length; i > 0; i -= 3) {
        if (formateado) formateado = '.' + formateado;
        formateado = cuerpo.slice(Math.max(0, i - 3), i) + formateado;
    }
    return formateado + '-' + dv;
}

// ========== USUARIOS (almacenados en localStorage) ==========
let users = [];
let currentUser = null;

function loadUsers() {
    const saved = localStorage.getItem('sgrm_users');
    if (saved) {
        users = JSON.parse(saved);
    } else {
        // Usuario demo de ejemplo
        users = [{
            id: '1',
            nombre: 'Juan',
            apPaterno: 'Pérez',
            apMaterno: 'González',
            email: 'admin@sgrm.cl',
            rut: '12.345.678-9',
            password: 'admin123',
            createdAt: new Date().toISOString()
        }];
        saveUsers();
    }
}

function saveUsers() {
    localStorage.setItem('sgrm_users', JSON.stringify(users));
}

function saveCurrentUser() {
    localStorage.setItem('sgrm_current_user', JSON.stringify(currentUser));
}

function loadCurrentUser() {
    const saved = localStorage.getItem('sgrm_current_user');
    if (saved) {
        currentUser = JSON.parse(saved);
        return true;
    }
    return false;
}

function clearCurrentUser() {
    localStorage.removeItem('sgrm_current_user');
    currentUser = null;
}

// ========== LOGIN ==========
function login(email, password) {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        currentUser = { ...user };
        delete currentUser.password;
        saveCurrentUser();
        return { success: true, user: currentUser };
    }
    return { success: false, error: '❌ Correo o contraseña incorrectos' };
}

// ========== REGISTRO ==========
function register(userData) {
    // Validar que el correo no exista
    if (users.find(u => u.email === userData.email)) {
        return { success: false, error: '❌ El correo ya está registrado' };
    }
    
    // Validar que tenga al menos un nombre
    if (!userData.nombre || userData.nombre.trim() === '') {
        return { success: false, error: '❌ Debes ingresar al menos un nombre' };
    }
    
    // Validar email
    if (!userData.email || !userData.email.includes('@')) {
        return { success: false, error: '❌ Correo electrónico inválido' };
    }
    
    // Validar RUT
    if (!validarRut(userData.rut)) {
        return { success: false, error: '❌ RUT inválido. Formato: 12.345.678-9 o 12345678-9' };
    }
    
    // Validar contraseña
    if (!userData.password || userData.password.length < 6) {
        return { success: false, error: '❌ La contraseña debe tener al menos 6 caracteres' };
    }
    
    if (userData.password !== userData.confirmPassword) {
        return { success: false, error: '❌ Las contraseñas no coinciden' };
    }
    
    // Crear usuario
    const newUser = {
        id: Date.now().toString(),
        nombre: userData.nombre.trim(),
        apPaterno: userData.apPaterno?.trim() || '',
        apMaterno: userData.apMaterno?.trim() || '',
        email: userData.email.trim(),
        rut: formatearRut(userData.rut),
        password: userData.password,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers();
    
    return { success: true, user: newUser };
}

// ========== ACTUALIZAR PERFIL ==========
function updateProfile(userId, updates, currentPassword) {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        return { success: false, error: 'Usuario no encontrado' };
    }
    
    const user = users[userIndex];
    
    // Verificar contraseña actual
    if (user.password !== currentPassword) {
        return { success: false, error: 'Contraseña actual incorrecta' };
    }
    
    // Actualizar datos
    if (updates.nombre !== undefined) user.nombre = updates.nombre;
    if (updates.apPaterno !== undefined) user.apPaterno = updates.apPaterno;
    if (updates.apMaterno !== undefined) user.apMaterno = updates.apMaterno;
    
    // Actualizar contraseña si se proporcionó una nueva
    if (updates.newPassword && updates.newPassword.length >= 6) {
        user.password = updates.newPassword;
    }
    
    users[userIndex] = user;
    saveUsers();
    
    // Actualizar currentUser
    if (currentUser && currentUser.id === userId) {
        currentUser = { ...user };
        delete currentUser.password;
        saveCurrentUser();
    }
    
    return { success: true, user };
}

function getFullName(user) {
    const parts = [user.nombre, user.apPaterno, user.apMaterno].filter(p => p && p.trim());
    return parts.length > 0 ? parts.join(' ') : user.email.split('@')[0];
}

// ========== DATOS DE LA APLICACIÓN ==========
let products = [
    { id: '1', code: 'PRD-001', name: 'Filtro de Aceite', description: 'Filtro premium', type: 'consumible', quantity: 12, minStock: 3, history: [] },
    { id: '2', code: 'PRD-002', name: 'Correa de Distribución', description: 'Correa reforzada', type: 'mecanico', quantity: 4, minStock: 2, history: [] },
    { id: '3', code: 'PRD-003', name: 'Bujía Iridio', description: 'Alta duración', type: 'electrico', quantity: 8, minStock: 4, history: [] }
];

let invoices = [];
let maintenances = [];
let stockItems = [];
let currentOp = 'purchase';

// ========== FUNCIONES AUXILIARES ==========
function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.borderLeftColor = type === 'success' ? '#00b894' : '#ff4757';
    toast.innerHTML = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function generateCode() {
    return 'PRD-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

function loadAppData() {
    if (currentUser) {
        const saved = localStorage.getItem(`sgrm_data_${currentUser.id}`);
        if (saved) {
            const data = JSON.parse(saved);
            products = data.products || products;
            invoices = data.invoices || invoices;
            maintenances = data.maintenances || maintenances;
        }
    }
}

function saveAppData() {
    if (currentUser) {
        const data = { products, invoices, maintenances };
        localStorage.setItem(`sgrm_data_${currentUser.id}`, JSON.stringify(data));
    }
}

// ========== RENDERIZAR ==========
function renderAll() {
    renderDashboard();
    renderProductsList();
    renderInventory();
    renderInvoices();
    renderMaintenances();
    renderProfile();
    updateSelects();
    updateUserInfo();
    saveAppData();
}

function updateUserInfo() {
    if (currentUser) {
        const userNameSpan = document.getElementById('userName');
        if (userNameSpan) userNameSpan.textContent = getFullName(currentUser);
    }
}

function renderProfile() {
    if (currentUser) {
        const profileNombre = document.getElementById('profileNombre');
        const profileEmail = document.getElementById('profileEmail');
        const profileRut = document.getElementById('profileRut');
        const profileSince = document.getElementById('profileSince');
        
        if (profileNombre) profileNombre.textContent = getFullName(currentUser);
        if (profileEmail) profileEmail.textContent = currentUser.email;
        if (profileRut) profileRut.textContent = currentUser.rut;
        if (profileSince) profileSince.textContent = new Date(currentUser.createdAt).toLocaleDateString();
    }
}

function renderDashboard() {
    const totalProducts = document.getElementById('totalProducts');
    const criticalStock = document.getElementById('criticalStock');
    const monthInvoices = document.getElementById('monthInvoices');
    const totalMaintenances = document.getElementById('totalMaintenances');
    const alertsList = document.getElementById('alertsList');
    const movementsList = document.getElementById('movementsList');
    
    if (totalProducts) totalProducts.textContent = products.length;
    if (criticalStock) criticalStock.textContent = products.filter(p => p.quantity <= p.minStock).length;
    if (monthInvoices) monthInvoices.textContent = invoices.length;
    if (totalMaintenances) totalMaintenances.textContent = maintenances.length;

    if (alertsList) {
        const alerts = products.filter(p => p.quantity <= p.minStock);
        const alertsHtml = alerts.map(a => `<div class="alert-item critical">⚠️ ${a.name}: Stock bajo (${a.quantity}/${a.minStock})</div>`).join('');
        alertsList.innerHTML = alertsHtml || '<div class="alert-item">✅ Sin alertas</div>';
    }

    if (movementsList) {
        const movements = [];
        products.forEach(p => {
            if (p.history && p.history.length) {
                movements.push(...p.history.slice(0, 3));
            }
        });
        const movementsHtml = movements.slice(0, 5).map(m => `<div class="movement-item">📅 ${new Date(m.timestamp).toLocaleString()}<br>${m.reason}</div>`).join('');
        movementsList.innerHTML = movementsHtml || '<div class="movement-item">Sin movimientos recientes</div>';
    }
}

function renderProductsList() {
    const searchProduct = document.getElementById('searchProduct');
    const productsList = document.getElementById('productsList');
    
    if (!productsList) return;
    
    const search = searchProduct?.value.toLowerCase() || '';
    const filtered = products.filter(p => p.name.toLowerCase().includes(search));
    const html = filtered.map(p => `
        <div class="product-item">
            <div>
                <strong>${p.name}</strong><br>
                <small>${p.code} | Stock: ${p.quantity}</small>
            </div>
            <button class="btn-danger" onclick="deleteProduct('${p.id}')">Eliminar</button>
        </div>
    `).join('');
    productsList.innerHTML = html || '<div>No hay productos</div>';
}

function renderInventory() {
    const searchInventory = document.getElementById('searchInventory');
    const stockFilter = document.getElementById('stockFilter');
    const inventoryBody = document.getElementById('inventoryBody');
    
    if (!inventoryBody) return;
    
    const search = searchInventory?.value.toLowerCase() || '';
    const filter = stockFilter?.value || 'all';
    let filtered = products.filter(p => p.name.toLowerCase().includes(search));
    
    if (filter === 'critical') filtered = filtered.filter(p => p.quantity <= p.minStock);
    if (filter === 'warning') filtered = filtered.filter(p => p.quantity > p.minStock && p.quantity <= p.minStock + 2);

    const html = filtered.map(p => {
        let status = p.quantity <= p.minStock ? 'danger' : (p.quantity <= p.minStock + 2 ? 'warning' : 'success');
        let statusText = status === 'danger' ? 'Crítico' : (status === 'warning' ? 'Bajo' : 'Ok');
        return `
            <tr onclick="showProductDetail('${p.id}')">
                <td>${p.code}</td>
                <td>${p.name}</td>
                <td>${p.type}</td>
                <td>${p.quantity}</td>
                <td>${p.minStock}</td>
                <td><span class="badge-${status}">${statusText}</span></td>
                <td><button class="btn-danger" onclick="event.stopPropagation(); deleteProduct('${p.id}')">🗑️</button></td>
            </tr>
        `;
    }).join('');
    inventoryBody.innerHTML = html || '<tr><td colspan="7">No hay productos</tr>';
}

function renderInvoices() {
    const invoicesList = document.getElementById('invoicesList');
    if (!invoicesList) return;
    
    const html = invoices.map(i => `
        <div class="invoice-item">
            <strong>🧾 Factura #${i.number}</strong><br>
            Fecha: ${i.date} | Proveedor: ${i.supplier}<br>
            Total: $${i.total}
        </div>
    `).join('');
    invoicesList.innerHTML = html || '<div>No hay facturas</div>';
}

function renderMaintenances() {
    const maintenanceBody = document.getElementById('maintenanceBody');
    if (!maintenanceBody) return;
    
    const html = maintenances.map(m => `
        <tr>
            <td>${m.equipment}</td>
            <td>${m.date}</td>
            <td>${m.type}</td>
            <td>${m.technician || '-'}</td>
            <td><span class="badge-warning">Programada</span></td>
            <td><button class="btn-danger" onclick="deleteMaintenance('${m.id}')">🗑️</button></td>
        </tr>
    `).join('');
    maintenanceBody.innerHTML = html || '<tr><td colspan="6">No hay mantenimientos</tr>';
}

function updateSelects() {
    // Actualizar selects si existen
    const selects = document.querySelectorAll('#maintParts, #invoiceProducts');
    selects.forEach(select => {
        if (select) {
            select.innerHTML = products.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
        }
    });
}

// ========== CRUD ==========
window.deleteProduct = function(id) {
    if (confirm('¿Eliminar producto?')) {
        products = products.filter(p => p.id !== id);
        renderAll();
        showToast('Producto eliminado', 'success');
    }
};

window.showProductDetail = function(id) {
    const p = products.find(p => p.id === id);
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalTitle || !modalBody) return;
    
    modalTitle.textContent = p.name;
    modalBody.innerHTML = `
        <p><strong>Código:</strong> ${p.code}</p>
        <p><strong>Descripción:</strong> ${p.description || '-'}</p>
        <p><strong>Tipo:</strong> ${p.type}</p>
        <p><strong>Cantidad:</strong> ${p.quantity}</p>
        <p><strong>Mínimo:</strong> ${p.minStock}</p>
        <hr>
        <strong>Historial:</strong>
        ${p.history && p.history.length ? p.history.map(h => `<div>📅 ${new Date(h.timestamp).toLocaleString()}<br>${h.reason}</div>`).join('') : '<div>Sin historial</div>'}
    `;
    modal.style.display = 'flex';
};

window.deleteMaintenance = function(id) {
    if (confirm('¿Cancelar mantenimiento?')) {
        maintenances = maintenances.filter(m => m.id !== id);
        renderAll();
        showToast('Mantenimiento cancelado', 'success');
    }
};

// ========== CREAR PRODUCTO ==========
const createProductForm = document.getElementById('createProductForm');
if (createProductForm) {
    createProductForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newProduct = {
            id: Date.now().toString(),
            code: generateCode(),
            name: document.getElementById('prodName')?.value,
            description: document.getElementById('prodDesc')?.value || '',
            type: document.getElementById('prodType')?.value || 'consumible',
            quantity: parseInt(document.getElementById('prodInitialStock')?.value) || 0,
            minStock: parseInt(document.getElementById('prodMinStock')?.value) || 3,
            history: []
        };
        if (newProduct.quantity > 0) {
            newProduct.history.push({ timestamp: new Date().toISOString(), reason: 'Stock inicial' });
        }
        products.push(newProduct);
        renderAll();
        createProductForm.reset();
        showToast('Producto creado', 'success');
    });
}

// ========== STOCK ITEMS ==========
function renderStockItems() {
    const container = document.getElementById('stockItemsList');
    if (!container) return;
    
    const productsList = products.map(p => `<option value="${p.id}">${p.name} (Stock: ${p.quantity})</option>`).join('');
    
    container.innerHTML = stockItems.map((item, idx) => `
        <div class="stock-item">
            <div class="stock-header">
                <span>Producto ${idx + 1}</span>
                <button class="btn-danger" onclick="removeStockItem(${idx})">✕</button>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Producto</label>
                    <select onchange="updateStockItem(${idx}, 'productId', this.value)">
                        <option value="">Seleccionar</option>
                        ${productsList}
                    </select>
                </div>
                <div class="form-group">
                    <label>Cantidad</label>
                    <input type="number" value="${item.quantity || 1}" onchange="updateStockItem(${idx}, 'quantity', this.value)">
                </div>
            </div>
        </div>
    `).join('');
}

window.updateStockItem = function(idx, field, value) {
    if (stockItems[idx]) {
        stockItems[idx][field] = value;
    }
};

window.removeStockItem = function(idx) {
    stockItems.splice(idx, 1);
    renderStockItems();
};

const addProductBtn = document.getElementById('addProductBtn');
if (addProductBtn) {
    addProductBtn.addEventListener('click', () => {
        stockItems.push({ productId: '', quantity: 1 });
        renderStockItems();
    });
}

// ========== OPERACIÓN (COMPRA/REINGRESO) ==========
const opBtns = document.querySelectorAll('.op-btn');
if (opBtns.length) {
    opBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            opBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentOp = btn.dataset.op;
            
            const purchaseSection = document.getElementById('purchaseSection');
            const returnSection = document.getElementById('returnSection');
            
            if (purchaseSection) purchaseSection.style.display = currentOp === 'purchase' ? 'block' : 'none';
            if (returnSection) returnSection.style.display = currentOp === 'return' ? 'block' : 'none';
        });
    });
}

// ========== GUARDAR STOCK ==========
const saveStockBtn = document.getElementById('saveStockBtn');
if (saveStockBtn) {
    saveStockBtn.addEventListener('click', () => {
        const validItems = stockItems.filter(item => item.productId);
        if (validItems.length === 0) {
            showToast('Agregue al menos un producto', 'error');
            return;
        }

        if (currentOp === 'purchase') {
            const invoiceNumber = document.getElementById('invoiceNumber')?.value;
            const invoiceDate = document.getElementById('invoiceDate')?.value;
            if (!invoiceNumber || !invoiceDate) {
                showToast('Complete los datos de factura', 'error');
                return;
            }
            
            const invoice = {
                id: Date.now().toString(),
                number: invoiceNumber,
                date: invoiceDate,
                supplier: document.getElementById('invoiceSupplier')?.value || 'Desconocido',
                total: 0
            };
            invoices.push(invoice);
            
            validItems.forEach(item => {
                const product = products.find(p => p.id === item.productId);
                if (product) {
                    product.quantity += parseInt(item.quantity);
                    product.history = product.history || [];
                    product.history.unshift({ timestamp: new Date().toISOString(), reason: `Compra factura ${invoiceNumber}` });
                }
            });
            showToast('Compra registrada', 'success');
        } else {
            const reason = document.getElementById('returnReason')?.value || 'no_utilizado';
            validItems.forEach(item => {
                const product = products.find(p => p.id === item.productId);
                if (product) {
                    product.quantity += parseInt(item.quantity);
                    product.history = product.history || [];
                    product.history.unshift({ timestamp: new Date().toISOString(), reason: `Reingreso: ${reason}` });
                }
            });
            showToast('Reingreso registrado', 'success');
        }

        stockItems = [];
        renderStockItems();
        
        const invoiceNumberInput = document.getElementById('invoiceNumber');
        const invoiceDateInput = document.getElementById('invoiceDate');
        const invoiceSupplierInput = document.getElementById('invoiceSupplier');
        const returnNoteTextarea = document.getElementById('returnNote');
        
        if (invoiceNumberInput) invoiceNumberInput.value = '';
        if (invoiceDateInput) invoiceDateInput.value = '';
        if (invoiceSupplierInput) invoiceSupplierInput.value = '';
        if (returnNoteTextarea) returnNoteTextarea.value = '';
        
        renderAll();
    });
}

// ========== LIMPIAR STOCK ==========
const clearStockBtn = document.getElementById('clearStockBtn');
if (clearStockBtn) {
    clearStockBtn.addEventListener('click', () => {
        stockItems = [];
        renderStockItems();
        
        const invoiceNumberInput = document.getElementById('invoiceNumber');
        const invoiceDateInput = document.getElementById('invoiceDate');
        const invoiceSupplierInput = document.getElementById('invoiceSupplier');
        const returnNoteTextarea = document.getElementById('returnNote');
        
        if (invoiceNumberInput) invoiceNumberInput.value = '';
        if (invoiceDateInput) invoiceDateInput.value = '';
        if (invoiceSupplierInput) invoiceSupplierInput.value = '';
        if (returnNoteTextarea) returnNoteTextarea.value = '';
    });
}

// ========== MANTENIMIENTO ==========
const maintenanceForm = document.getElementById('maintenanceForm');
if (maintenanceForm) {
    maintenanceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newMaint = {
            id: Date.now().toString(),
            equipment: document.getElementById('maintEquipment')?.value,
            date: document.getElementById('maintDate')?.value,
            type: document.getElementById('maintType')?.value,
            tasks: document.getElementById('maintTasks')?.value || '',
            technician: document.getElementById('maintTechnician')?.value || '',
            status: 'scheduled'
        };
        maintenances.push(newMaint);
        renderAll();
        maintenanceForm.reset();
        showToast('Mantenimiento programado', 'success');
    });
}

// ========== NAVEGACIÓN ==========
const menuBtns = document.querySelectorAll('.menu-btn');
if (menuBtns.length) {
    menuBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            menuBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const sections = document.querySelectorAll('.section');
            sections.forEach(s => s.classList.remove('active'));
            const sectionId = btn.dataset.section;
            const targetSection = document.getElementById(sectionId);
            if (targetSection) targetSection.classList.add('active');
        });
    });
}

// ========== MODALES ==========
const modalCloseBtns = document.querySelectorAll('.modal-close');
if (modalCloseBtns.length) {
    modalCloseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = document.getElementById('modal');
            const editModal = document.getElementById('editProfileModal');
            if (modal) modal.style.display = 'none';
            if (editModal) editModal.style.display = 'none';
        });
    });
}

window.addEventListener('click', (e) => {
    const modal = document.getElementById('modal');
    const editModal = document.getElementById('editProfileModal');
    if (e.target === modal && modal) modal.style.display = 'none';
    if (e.target === editModal && editModal) editModal.style.display = 'none';
});

// ========== FILTROS ==========
const searchInventory = document.getElementById('searchInventory');
if (searchInventory) searchInventory.addEventListener('input', () => renderInventory());

const stockFilter = document.getElementById('stockFilter');
if (stockFilter) stockFilter.addEventListener('change', () => renderInventory());

const searchProduct = document.getElementById('searchProduct');
if (searchProduct) searchProduct.addEventListener('input', () => renderProductsList());

// ========== BACKUP / RESTORE / AUDIT ==========
const btnBackup = document.getElementById('btnBackup');
if (btnBackup) {
    btnBackup.addEventListener('click', () => {
        const data = { products, invoices, maintenances };
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        showToast('Backup creado', 'success');
    });
}

const btnRestore = document.getElementById('btnRestore');
if (btnRestore) {
    btnRestore.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (ev) => {
                const data = JSON.parse(ev.target.result);
                products = data.products || [];
                invoices = data.invoices || [];
                maintenances = data.maintenances || [];
                renderAll();
                showToast('Datos restaurados', 'success');
            };
            reader.readAsText(file);
        };
        input.click();
    });
}

const btnAudit = document.getElementById('btnAudit');
if (btnAudit) {
    btnAudit.addEventListener('click', () => {
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        if (!modal || !modalTitle || !modalBody) return;
        
        modalTitle.textContent = '📋 Auditoría';
        let auditHtml = '<div><strong>📦 Productos:</strong></div>';
        products.forEach(p => {
            auditHtml += `<div class="movement-item">📦 ${p.name} - Stock: ${p.quantity}</div>`;
            if (p.history && p.history.length) {
                p.history.slice(0, 3).forEach(h => {
                    auditHtml += `<div class="movement-item" style="margin-left: 1rem;">📅 ${new Date(h.timestamp).toLocaleString()}<br>${h.reason}</div>`;
                });
            }
        });
        modalBody.innerHTML = auditHtml;
        modal.style.display = 'flex';
    });
}

// ========== LOGOUT ==========
const btnLogout = document.getElementById('btnLogout');
if (btnLogout) {
    btnLogout.addEventListener('click', () => {
        clearCurrentUser();
        const loginScreen = document.getElementById('loginScreen');
        const appScreen = document.getElementById('appScreen');
        if (loginScreen) loginScreen.style.display = 'flex';
        if (appScreen) appScreen.style.display = 'none';
        showToast('Sesión cerrada', 'info');
    });
}

// ========== EDITAR PERFIL ==========
const btnEditProfile = document.getElementById('btnEditProfile');
const editProfileModal = document.getElementById('editProfileModal');
const editProfileForm = document.getElementById('editProfileForm');

if (btnEditProfile && editProfileModal) {
    btnEditProfile.addEventListener('click', () => {
        if (currentUser) {
            const editNombre = document.getElementById('editNombre');
            const editApPaterno = document.getElementById('editApPaterno');
            const editApMaterno = document.getElementById('editApMaterno');
            
            if (editNombre) editNombre.value = currentUser.nombre || '';
            if (editApPaterno) editApPaterno.value = currentUser.apPaterno || '';
            if (editApMaterno) editApMaterno.value = currentUser.apMaterno || '';
            
            editProfileModal.style.display = 'flex';
        }
    });
}

if (editProfileForm) {
    editProfileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const currentPassword = document.getElementById('editCurrentPassword')?.value;
        const newPassword = document.getElementById('editNewPassword')?.value;
        const confirmPassword = document.getElementById('editConfirmPassword')?.value;
        
        if (!currentPassword) {
            showToast('Ingrese su contraseña actual', 'error');
            return;
        }
        
        if (newPassword && newPassword !== confirmPassword) {
            showToast('Las contraseñas no coinciden', 'error');
            return;
        }
        
        const updates = {
            nombre: document.getElementById('editNombre')?.value || '',
            apPaterno: document.getElementById('editApPaterno')?.value || '',
            apMaterno: document.getElementById('editApMaterno')?.value || '',
            newPassword: newPassword
        };
        
        const result = updateProfile(currentUser.id, updates, currentPassword);
        
        if (result.success) {
            showToast('Perfil actualizado correctamente', 'success');
            if (editProfileModal) editProfileModal.style.display = 'none';
            renderProfile();
            updateUserInfo();
            editProfileForm.reset();
        } else {
            showToast(result.error, 'error');
        }
    });
}

// ========== LOGIN Y REGISTRO ==========
function initAuth() {
    loadUsers();
    
    // Verificar si hay sesión guardada
    if (loadCurrentUser()) {
        // Cargar datos del usuario y mostrar app
        loadAppData();
        const loginScreen = document.getElementById('loginScreen');
        const appScreen = document.getElementById('appScreen');
        if (loginScreen) loginScreen.style.display = 'none';
        if (appScreen) appScreen.style.display = 'block';
        renderAll();
        
        // Inicializar stockItems
        stockItems = [{ productId: '', quantity: 1 }];
        renderStockItems();
        return;
    }
    
    // Mostrar pantalla de login
    const loginScreen = document.getElementById('loginScreen');
    const appScreen = document.getElementById('appScreen');
    if (loginScreen) loginScreen.style.display = 'flex';
    if (appScreen) appScreen.style.display = 'none';
    
    // Configurar tabs de login/registro
    const loginTabs = document.querySelectorAll('.login-tab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginTabs.length) {
        loginTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                loginTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const target = tab.dataset.tab;
                if (loginForm) loginForm.classList.toggle('active', target === 'login');
                if (registerForm) registerForm.classList.toggle('active', target === 'register');
            });
        });
    }
    
    // Login
    const loginFormElement = document.getElementById('loginForm');
    if (loginFormElement) {
        loginFormElement.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail')?.value;
            const password = document.getElementById('loginPassword')?.value;
            const loginError = document.getElementById('loginError');
            
            const result = login(email, password);
            if (result.success) {
                loadAppData();
                if (loginScreen) loginScreen.style.display = 'none';
                if (appScreen) appScreen.style.display = 'block';
                renderAll();
                stockItems = [{ productId: '', quantity: 1 }];
                renderStockItems();
                showToast(`Bienvenido ${getFullName(currentUser)}`, 'success');
            } else {
                if (loginError) loginError.textContent = result.error;
            }
        });
    }
    
    // Registro
    const registerFormElement = document.getElementById('registerForm');
    if (registerFormElement) {
        registerFormElement.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const userData = {
                nombre: document.getElementById('regNombre')?.value || '',
                apPaterno: document.getElementById('regApPaterno')?.value || '',
                apMaterno: document.getElementById('regApMaterno')?.value || '',
                email: document.getElementById('regEmail')?.value || '',
                rut: document.getElementById('regRut')?.value || '',
                password: document.getElementById('regPassword')?.value || '',
                confirmPassword: document.getElementById('regConfirmPassword')?.value || ''
            };
            
            const registerError = document.getElementById('registerError');
            const result = register(userData);
            
            if (result.success) {
                // Cambiar a pestaña de login
                const loginTab = document.querySelector('.login-tab[data-tab="login"]');
                if (loginTab) loginTab.click();
                
                // Limpiar formulario
                registerFormElement.reset();
                if (registerError) registerError.textContent = '';
                
                showToast('✅ Cuenta creada exitosamente. Ahora inicia sesión.', 'success');
            } else {
                if (registerError) registerError.textContent = result.error;
            }
        });
    }
}

// ========== INICIALIZAR ==========
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
});