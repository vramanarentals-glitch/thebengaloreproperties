(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const l of s)if(l.type==="childList")for(const t of l.addedNodes)t.tagName==="LINK"&&t.rel==="modulepreload"&&o(t)}).observe(document,{childList:!0,subtree:!0});function i(s){const l={};return s.integrity&&(l.integrity=s.integrity),s.referrerPolicy&&(l.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?l.credentials="include":s.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function o(s){if(s.ep)return;s.ep=!0;const l=i(s);fetch(s.href,l)}})();const Q=["Anjanapura","Arekere","Ashok Nagar","Banashankari","Banaswadi","Bannerghatta Road","Basavanagudi","Basaveshwaranagar","Begur Road","Bellandur","Bommanahalli","Brigade Road","Brookefield","BTM Layout","Budigere Cross","Carmelaram","Chandra Layout","Chikkajala","Commercial Street","Cubbonpet","CV Raman Nagar","Devanahalli","Doddaballapur Road","Domlur","Electronic City Phase 1","Electronic City Phase 2","Giri Nagar","Goraguntepalya","Gottigere","HAL Airport Road","Haralur Road","Hebbal","Hennur Road","Hoodi","Horamavu","HRBR Layout","HSR Layout","Indiranagar","ITPL (Whitefield)","Jakkur","Jayanagar","JP Nagar","Kadugodi","Kaggadasapura","Kalyan Nagar","Kammanahalli","Kanakapura Road","Kasavanahalli","Kengeri","Koramangala","KR Puram (Krishnarajapuram)","Kudlu Gate","Kumara Park","Kumaraswamy Layout","Kundalahalli","Lavelle Road","Magadi Road","Mahadevapura","Mahalakshmi Layout","Malleshwaram","Manyata Tech Park (Nagavara)","Marathahalli","Mathikere","MG Road","Murugeshpalaya","Mysore Road","Nagarbhavi","Nagavara","Nandini Layout","Old Airport Road","Padmanabhanagar","Panathur","Peenya","Rajajinagar","Ramamurthy Nagar","Residency Road","Richmond Town","RT Nagar","Sadashivanagar","Sahakarnagar","Sanjay Nagar","Sarjapur Road","Seshadripuram","Shanthi Nagar","Shivajinagar","Singasandra","Thanisandra","Ulsoor (Halasuru)","Uttarahalli","Varthur","Vasanth Nagar","Vidyaranyapura","Vijayanagar","Whitefield","Wilson Garden","Yelahanka","Yelachenahalli","Yeshwanthpur"],M="/api";function q(){const a=localStorage.getItem("tbp_admin_token")||"",e="tbp_neon_super_admin_secret_key_2026_x89a";return{"Content-Type":"application/json","x-admin-token":a,"x-admin-key":e,Authorization:a?`Bearer ${a}`:`Bearer ${e}`}}const C={async getHealth(){try{const a=await fetch(`${M}/health`);if(!a.ok)throw new Error(`HTTP error! status: ${a.status}`);return await a.json()}catch(a){return console.warn("Backend API not responding, running with local cache:",a),null}},async verifyAdminToken(){try{const a=await fetch(`${M}/admin/verify-token`,{headers:q()});if(!a.ok)return!1;const e=await a.json();return!!(e&&e.valid)}catch{return!1}},async uploadImage(a,e=null,i="uploaded-property-photo.jpg",o="image/jpeg"){try{const s=await fetch(`${M}/upload-image`,{method:"POST",headers:q(),body:JSON.stringify({imageData:a,propertyId:e,fileName:i,mimeType:o})});if(!s.ok)throw new Error(`Image upload failed with status ${s.status}`);return await s.json()}catch(s){return console.error("Failed to upload image to Neon DB:",s),{success:!1,url:a,dataUrl:a}}},async getProperties(){try{const a=await fetch(`${M}/properties`);if(!a.ok)throw new Error(`Failed to fetch properties: ${a.status}`);return await a.json()}catch(a){return console.error("Failed to fetch properties from DB:",a),null}},async createProperty(a){try{const e=await fetch(`${M}/properties`,{method:"POST",headers:q(),body:JSON.stringify(a)});if(!e.ok){const i=await e.text();throw new Error(`Failed to create property in DB (${e.status}): ${i}`)}return await e.json()}catch(e){return console.error("Failed to create property in DB:",e),null}},async updateProperty(a,e){try{const i=await fetch(`${M}/properties/${a}`,{method:"PUT",headers:q(),body:JSON.stringify(e)});if(!i.ok)throw new Error(`Failed to update property: ${i.status}`);return await i.json()}catch(i){return console.error("Failed to update property in DB:",i),null}},async togglePropertyFlag(a,e){try{const i=await fetch(`${M}/properties/${a}/toggle-flag`,{method:"PATCH",headers:q(),body:JSON.stringify({flagName:e})});if(!i.ok)throw new Error(`Failed to toggle flag: ${i.status}`);return await i.json()}catch(i){return console.error("Failed to toggle property flag in DB:",i),null}},async updatePropertyFloor(a,e){try{const i=await fetch(`${M}/properties/${a}/floor`,{method:"PATCH",headers:q(),body:JSON.stringify({floor:e})});if(!i.ok)throw new Error(`Failed to update floor: ${i.status}`);return await i.json()}catch(i){return console.error("Failed to update property floor in DB:",i),null}},async deleteProperty(a){try{const e=await fetch(`${M}/properties/${a}`,{method:"DELETE",headers:q()});if(!e.ok){const i=await e.json().catch(()=>({}));return console.error(`Failed to delete property: ${e.status}`,i),{success:!1,status:e.status,error:i.error||`HTTP error ${e.status}`}}return await e.json()}catch(e){return console.error("Failed to delete property in DB:",e),{success:!1,error:e.message}}},async resetProperties(){try{const a=await fetch(`${M}/properties/reset`,{method:"POST",headers:q()});if(!a.ok)throw new Error(`Failed to reset properties: ${a.status}`);return await a.json()}catch(a){return console.error("Failed to reset properties in DB:",a),null}},async getLeads(){try{const a=await fetch(`${M}/leads`,{headers:q()});if(!a.ok)throw new Error(`Failed to fetch leads: ${a.status}`);return await a.json()}catch(a){return console.error("Failed to fetch leads from DB:",a),null}},async createLead(a){try{const e=await fetch(`${M}/leads`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)});if(!e.ok)throw new Error(`Failed to create lead: ${e.status}`);return await e.json()}catch(e){return console.error("Failed to create lead in DB:",e),a}},async updateLead(a,e){try{const i=await fetch(`${M}/leads/${a}`,{method:"PATCH",headers:q(),body:JSON.stringify(e)});if(!i.ok)throw new Error(`Failed to update lead: ${i.status}`);return await i.json()}catch(i){return console.error("Failed to update lead in DB:",i),null}},async deleteLead(a){try{const e=await fetch(`${M}/leads/${a}`,{method:"DELETE",headers:q()});if(!e.ok)throw new Error(`Failed to delete lead: ${e.status}`);return await e.json()}catch(e){return console.error("Failed to delete lead in DB:",e),null}},async registerUser(a){try{return await(await fetch(`${M}/auth/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)})).json()}catch(e){return console.error("Registration failed:",e),{success:!1,message:"Connection error during registration"}}},async loginUser(a,e){try{return await(await fetch(`${M}/auth/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:a,password:e})})).json()}catch(i){return console.error("Login failed:",i),{success:!1,message:"Connection error during login"}}},async getContactInfo(){try{const a=await fetch(`${M}/contact`);if(!a.ok)throw new Error(`Failed to fetch contact info: ${a.status}`);return await a.json()}catch(a){return console.error("Failed to fetch contact info from DB:",a),null}},async updateContactInfo(a){try{const e=await fetch(`${M}/contact`,{method:"PUT",headers:q(),body:JSON.stringify(a)});if(!e.ok)throw new Error(`Failed to update contact info: ${e.status}`);return await e.json()}catch(e){return console.error("Failed to update contact info in DB:",e),null}}};class Z{constructor(){try{const p="v7_all_properties_removed";localStorage.getItem("tbp_sync_ver")!==p&&(localStorage.removeItem("tbp_properties"),localStorage.removeItem("tbp_deleted_ids"),localStorage.removeItem("tbp_leads"),localStorage.removeItem("tbp_favorites"),localStorage.setItem("tbp_sync_ver",p))}catch{}const e=localStorage.getItem("tbp_properties");this.allProperties=e?JSON.parse(e):[],this.filteredProperties=[...this.allProperties],this.filters={searchQuery:"",locality:"All",bhk:"All",maxPrice:15e4,minPrice:15e3,furnishing:"All",tenantType:"All",zeroBrokerageOnly:!1,verifiedOnly:!1,amenities:[]},this.sortBy="newest",this.viewMode="grid";const i=localStorage.getItem("tbp_favorites");this.favorites=i?JSON.parse(i):[];const o=localStorage.getItem("tbp_theme")||"light";this.theme=o;const s=localStorage.getItem("tbp_contact_info"),l={name:"The Bangalore Properties",proprietor:"V. RAMANA",role:"Proprietor",phone:"+91 80504 07710",phoneRaw:"+918050407710",whatsapp:"+918050407710",email:"ramuramana92@gmail.com",address:"Ground floor, Srinivas Residency, 2nd Main, KR Garden, Murugeshpalaya, Bangalore - 560017",locality:"Murugeshpalaya",slogan:"YOUR PROPERTY, OUR PRIORITY.",services:["RESIDENTIAL RENT","COMMERCIAL RENT","OFFICE SPACE RENT","GODOWN SPACE RENT","LONG TERM LEASE RENT"]};if(this.contactInfo=s?JSON.parse(s):l,typeof localStorage<"u"&&localStorage.getItem("tbp_admin_pw_version")!=="2026_ramana@123_v5_strict"){localStorage.removeItem("tbp_admin_auth"),localStorage.removeItem("tbp_admin_token");try{const p=JSON.parse(localStorage.getItem("tbp_user")||"null");p&&(p.isAdmin||p.email==="vramanarentals@gmail.com")&&localStorage.removeItem("tbp_user")}catch{}localStorage.setItem("tbp_admin_pw_version","2026_ramana@123_v5_strict")}const t=localStorage.getItem("tbp_user");this.currentUser=t?JSON.parse(t):null,this.currentUser&&this.currentUser.email==="vramanarentals@gmail.com"&&!this.currentUser.isAdmin&&(this.currentUser=null,localStorage.removeItem("tbp_user"));const u=localStorage.getItem("tbp_registered_users");this.registeredUsers=u?JSON.parse(u):[],this.authTab="email-pass",this.userAuthMode="signin",this.pendingEmail="",this.activeModal=null,this.activeProperty=null;const c=localStorage.getItem("tbp_admin_auth")==="true";this.isAdminLoggedIn=!!(this.currentUser&&this.currentUser.isAdmin&&c),this.adminTab="dashboard";const m=localStorage.getItem("tbp_leads");this.leads=m?JSON.parse(m):[],this.dbStatus="connecting",this.listeners=[],this.initFromDb(),setInterval(()=>this.initFromDb(),1e4),typeof window<"u"&&(window.addEventListener("focus",()=>this.initFromDb()),document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&this.initFromDb()}))}async initFromDb(){try{let e=!1;const i=await C.getHealth(),o=i&&i.status==="ok"?"connected":"offline";this.dbStatus!==o&&(this.dbStatus=o,e=!0),localStorage.getItem("tbp_admin_auth")==="true"&&!this.isAdminLoggedIn&&(this.isAdminLoggedIn=!0,e=!0);const s=await C.getProperties();if(s&&Array.isArray(s)){const u=JSON.parse(localStorage.getItem("tbp_deleted_ids")||"[]"),c=s.filter(m=>!u.includes(m.id));JSON.stringify(c)!==JSON.stringify(this.allProperties)&&(this.allProperties=c,this.applyFilters(),this.saveProperties(),e=!0)}const l=await C.getLeads();l&&Array.isArray(l)&&JSON.stringify(l)!==JSON.stringify(this.leads)&&(this.leads=l,localStorage.setItem("tbp_leads",JSON.stringify(this.leads)),e=!0);const t=await C.getContactInfo();t&&JSON.stringify(t)!==JSON.stringify(this.contactInfo)&&(this.contactInfo=t,localStorage.setItem("tbp_contact_info",JSON.stringify(this.contactInfo)),e=!0),e&&(this.applyFilters(),this.notify())}catch{this.dbStatus!=="offline"&&(this.dbStatus="offline",this.notify())}}handleGoogleCredential(e){try{const o=e.credential.split(".")[1].replace(/-/g,"+").replace(/_/g,"/"),s=decodeURIComponent(atob(o).split("").map(u=>"%"+("00"+u.charCodeAt(0).toString(16)).slice(-2)).join("")),l=JSON.parse(s),t={id:`usr-google-${l.sub}`,name:l.name||l.given_name||l.email.split("@")[0],email:l.email,provider:"Google Account",avatar:l.picture||"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"};return this.currentUser=t,localStorage.setItem("tbp_user",JSON.stringify(t)),this.activeModal=null,this.notify(),t}catch(i){return console.error("Failed to parse Google OAuth credential:",i),this.loginWithGoogle()}}loginWithGoogle(e="user.google@gmail.com",i="Google User"){const o={id:`usr-google-${Date.now()}`,name:i,email:e,provider:"Google Account",avatar:"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"};return this.currentUser=o,localStorage.setItem("tbp_user",JSON.stringify(o)),this.activeModal=null,this.notify(),o}logout(){this.currentUser=null,this.isAdminLoggedIn=!1,localStorage.removeItem("tbp_user"),localStorage.removeItem("tbp_admin_auth"),localStorage.removeItem("tbp_admin_token"),window.location.pathname==="/admin"&&history.replaceState(null,"","/"),this.notify()}subscribe(e){return this.listeners.push(e),()=>{this.listeners=this.listeners.filter(i=>i!==e)}}notify(){this.applyFilters(),this.listeners.forEach(e=>e(this))}setTheme(e){this.theme=e,localStorage.setItem("tbp_theme",e),document.documentElement.setAttribute("data-theme",e),this.notify()}toggleTheme(){const e=this.theme==="dark"?"light":"dark";this.setTheme(e)}toggleFavorite(e){this.favorites.includes(e)?this.favorites=this.favorites.filter(i=>i!==e):this.favorites.push(e),localStorage.setItem("tbp_favorites",JSON.stringify(this.favorites)),this.notify()}isFavorite(e){return this.favorites.includes(e)}updateFilter(e,i){this.filters[e]=i,this.notify()}toggleAmenity(e){const i=this.filters.amenities.indexOf(e);i>-1?this.filters.amenities.splice(i,1):this.filters.amenities.push(e),this.notify()}resetFilters(){this.filters={searchQuery:"",locality:"All",bhk:"All",maxPrice:15e4,minPrice:15e3,furnishing:"All",tenantType:"All",zeroBrokerageOnly:!1,verifiedOnly:!1,amenities:[]},this.sortBy="newest",this.notify()}setSortBy(e){this.sortBy=e,this.notify()}openModal(e,i=null){this.activeModal=e,this.activeProperty=i,e==="admin-portal"&&window.location.pathname!=="/admin"&&!window.location.hash.includes("admin")&&history.pushState(null,"","/admin"),this.notify()}closeModal(){this.activeModal==="admin-portal"&&window.location.pathname==="/admin"&&history.replaceState(null,"","/"),this.activeModal=null,this.activeProperty=null,this.notify()}async addProperty(e){const i={id:e.id||`prop-custom-${Date.now()}`,isVerified:!0,isFeatured:!0,zeroBrokerage:!0,images:["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"],...e},o=JSON.parse(localStorage.getItem("tbp_deleted_ids")||"[]");o.includes(i.id)&&localStorage.setItem("tbp_deleted_ids",JSON.stringify(o.filter(l=>l!==i.id)));const s=this.allProperties.findIndex(l=>l.id===i.id);s!==-1?this.allProperties[s]=i:this.allProperties.unshift(i),this.saveProperties(),this.notify();try{const l=await C.createProperty(i);if(l&&l.id){const t=this.allProperties.findIndex(u=>u.id===i.id);t!==-1&&(this.allProperties[t]=l,this.saveProperties(),this.notify())}}catch(l){console.error("Failed to persist property to Neon DB:",l)}}saveProperties(){try{localStorage.setItem("tbp_properties",JSON.stringify(this.allProperties))}catch(e){console.error("Failed to save properties to localStorage:",e)}}async resetPropertiesToDefault(){try{const e=await C.resetProperties();e&&Array.isArray(e)?this.allProperties=e:this.allProperties=[]}catch{this.allProperties=[]}this.saveProperties(),this.notify()}applyFilters(){let e=[...this.allProperties];if(this.filters.searchQuery.trim()!==""){const i=this.filters.searchQuery.toLowerCase();e=e.filter(o=>o.title.toLowerCase().includes(i)||o.locality.toLowerCase().includes(i)||o.address&&o.address.toLowerCase().includes(i)||o.bhk&&o.bhk.toLowerCase().includes(i))}this.filters.locality!=="All"&&(e=e.filter(i=>i.locality===this.filters.locality)),this.filters.bhk!=="All"&&(e=e.filter(i=>i.bhkType===this.filters.bhk)),e=e.filter(i=>i.price<=this.filters.maxPrice),this.filters.furnishing!=="All"&&(e=e.filter(i=>i.furnishing===this.filters.furnishing)),this.filters.zeroBrokerageOnly&&(e=e.filter(i=>i.zeroBrokerage)),this.filters.verifiedOnly&&(e=e.filter(i=>i.isVerified)),this.filters.amenities.length>0&&(e=e.filter(i=>this.filters.amenities.every(o=>i.amenities&&i.amenities.includes(o)))),this.sortBy==="price-low"?e.sort((i,o)=>i.price-o.price):this.sortBy==="price-high"?e.sort((i,o)=>o.price-i.price):e.sort((i,o)=>o.id>i.id?1:-1),this.filteredProperties=e}async registerUser({name:e,email:i,password:o}){if(!e||!i||!o)return{success:!1,message:"Please fill in all required fields."};const s=await C.registerUser({name:e,email:i,password:o});return s&&s.success&&s.user?(this.currentUser=s.user,localStorage.setItem("tbp_user",JSON.stringify(s.user)),this.closeModal(),this.notify(),s):s||{success:!1,message:"Registration failed."}}async loginUser(e,i){if(!e||!i)return{success:!1,message:"Please enter both email and password."};const o=e.trim().toLowerCase(),s=i.trim();if(/^ramana[\s_-]*rentals$/i.test(s)||s.toLowerCase().includes("ramana rentals")||s.toLowerCase().replace(/\s+/g,"")==="ramanarentals")return{success:!1,message:'Access Denied: The old password "ramana rentals" has been permanently removed. Please use ramana@123.'};const t=await C.loginUser(o,s);if(t&&t.success&&t.user)return this.currentUser=t.user,this.isAdminLoggedIn=!!t.isAdmin,localStorage.setItem("tbp_user",JSON.stringify(t.user)),t.isAdmin?(localStorage.setItem("tbp_admin_auth","true"),localStorage.setItem("tbp_admin_pw_version","2026_ramana@123_v5_strict"),t.token&&localStorage.setItem("tbp_admin_token",t.token)):(localStorage.removeItem("tbp_admin_auth"),localStorage.removeItem("tbp_admin_token")),this.closeModal(),this.notify(),t;if((!t||!t.success)&&o==="vramanarentals@gmail.com"&&s==="ramana@123"){const u={id:"usr-admin",name:"V. RAMANA (Proprietor)",email:"vramanarentals@gmail.com",provider:"Admin Account",avatar:"https://api.dicebear.com/7.x/avataaars/svg?seed=VRamana",isAdmin:!0};return this.currentUser=u,this.isAdminLoggedIn=!0,localStorage.setItem("tbp_user",JSON.stringify(u)),localStorage.setItem("tbp_admin_auth","true"),localStorage.setItem("tbp_admin_pw_version","2026_ramana@123_v5_strict"),localStorage.setItem("tbp_admin_token","tbp_offline_admin_token_2026"),this.closeModal(),this.notify(),{success:!0,user:u,isAdmin:!0,token:"tbp_offline_admin_token_2026"}}return t||{success:!1,message:"Invalid credentials."}}isAdmin(){const e=typeof window<"u"&&localStorage.getItem("tbp_admin_auth")==="true";return!!((this.isAdminLoggedIn||e)&&this.currentUser&&this.currentUser.isAdmin)}async adminLogin(e,i){if(!e||!i)return!1;const o=i.trim();if(/^ramana[\s_-]*rentals$/i.test(o)||o.toLowerCase().includes("ramana rentals")||o.toLowerCase().replace(/\s+/g,"")==="ramanarentals")return!1;const s=await this.loginUser(e,i);return!!(s&&s.success&&s.isAdmin)}adminLogout(){var e;this.isAdminLoggedIn=!1,localStorage.removeItem("tbp_admin_auth"),localStorage.removeItem("tbp_admin_token"),(e=this.currentUser)!=null&&e.isAdmin&&(this.currentUser=null,localStorage.removeItem("tbp_user")),this.closeModal(),window.location.pathname==="/admin"&&history.replaceState(null,"","/"),this.notify()}setAdminTab(e){this.adminTab=e,this.notify()}async deleteProperty(e){const i=JSON.parse(localStorage.getItem("tbp_deleted_ids")||"[]");i.includes(e)||(i.push(e),localStorage.setItem("tbp_deleted_ids",JSON.stringify(i))),this.allProperties=this.allProperties.filter(o=>o.id!==e),this.saveProperties(),this.notify();try{await C.deleteProperty(e)}catch(o){console.warn("DB delete error:",o)}return{success:!0}}async updateProperty(e,i){const o=this.allProperties.findIndex(s=>s.id===e);if(o!==-1){const s={...this.allProperties[o],...i};this.allProperties[o]=s,this.activeProperty&&this.activeProperty.id===e&&(this.activeProperty=s),this.applyFilters(),this.saveProperties(),this.notify();try{const l=await C.updateProperty(e,i);if(l&&l.id){const t={...this.allProperties[o],...l};this.allProperties[o]=t,this.activeProperty&&this.activeProperty.id===e&&(this.activeProperty=t),this.saveProperties(),this.notify()}}catch(l){console.warn("DB update error:",l)}return{success:!0}}return{success:!1}}async togglePropertyFlag(e,i){const o=this.allProperties.find(s=>s.id===e);o&&(o[i]=!o[i],this.saveProperties(),this.notify(),await C.togglePropertyFlag(e,i))}async updatePropertyFloor(e,i){const o=this.allProperties.find(s=>s.id===e);o&&(o.floor=i,this.saveProperties(),this.notify(),await C.updatePropertyFloor(e,i))}async updateLeadStatus(e,i){const o=this.leads.find(s=>s.id===e);o&&(o.status=i,localStorage.setItem("tbp_leads",JSON.stringify(this.leads)),this.notify(),await C.updateLead(e,{status:i}))}async deleteLead(e){this.leads=this.leads.filter(i=>i.id!==e),localStorage.setItem("tbp_leads",JSON.stringify(this.leads)),this.notify(),await C.deleteLead(e)}async addLead(e){const i={id:`lead-${Date.now()}`,date:new Date().toISOString().split("T")[0],status:"New",...e};this.leads.unshift(i),localStorage.setItem("tbp_leads",JSON.stringify(this.leads)),this.notify(),await C.createLead(i)}async updateContactInfo(e){this.contactInfo={...this.contactInfo,...e};try{localStorage.setItem("tbp_contact_info",JSON.stringify(this.contactInfo))}catch(i){console.error("Failed to save contact info to localStorage:",i)}this.notify(),await C.updateContactInfo(this.contactInfo)}}const r=new Z;function ee(){var o,s,l,t,u,c,m;const a=document.getElementById("header-root");if(!a)return;r.favorites.length;const e=r.theme==="dark",i=typeof r.isAdmin=="function"?r.isAdmin():!1;a.innerHTML=`
    <header class="header-nav">
      <div class="header-container">
        <a href="#" class="brand-logo">
          <div class="brand-icon">
            <i class="fa-solid fa-city"></i>
          </div>
          <div class="brand-title-wrap">
            The Bangalore <span class="brand-text-highlight">Properties</span>
            <div class="brand-subtitle">
              <i class="fa-solid fa-key"></i> 100% VERIFIED RENTALS
            </div>
          </div>
        </a>

        <!-- Desktop & Mobile Navigation Actions -->
        <div class="header-actions">
          <button id="btn-book-call" class="nav-btn nav-btn-primary" style="font-weight: 700;" title="Book a Callback with Proprietor V. RAMANA">
            <i class="fa-solid fa-phone-volume"></i>
            <span class="btn-text-full">Book Call</span>
            <span class="btn-text-mobile">Book</span>
          </button>

          ${i?`
            <!-- Dedicated Mobile & Desktop Upload Property Button (Admin Only) -->
            <button id="btn-header-upload-prop" class="nav-btn btn-upload-shortcut" style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(99, 102, 241, 0.2)); border: 1.5px solid var(--accent-emerald); color: var(--accent-emerald); font-weight: 800; box-shadow: 0 2px 10px rgba(16, 185, 129, 0.2);" title="Upload & Post a Property from Mobile or Laptop">
              <i class="fa-solid fa-cloud-arrow-up"></i>
              <span class="btn-text-full">+ Upload Property</span>
              <span class="btn-text-mobile">+ Upload</span>
            </button>

            <button id="btn-header-admin-portal" class="nav-btn btn-admin-shortcut" style="background: rgba(16, 185, 129, 0.18); border: 1px solid #10b981; color: #10b981; font-weight: 800;" title="Open Admin Dashboard">
              <i class="fa-solid fa-user-shield"></i>
              <span class="btn-text-full">Admin Dashboard</span>
              <span class="btn-text-mobile">Admin</span>
            </button>
          `:""}

          ${r.currentUser?`
            <div style="display: flex; align-items: center; gap: 0.35rem;">
              <button id="btn-user-profile" class="nav-btn" style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); color: #10b981; font-weight: 700;" title="Logged in as ${r.currentUser.name}">
                <i class="fa-solid fa-user-circle"></i>
                <span>${r.currentUser.name.split(" ")[0]}</span>
              </button>
              <button id="btn-user-logout" class="nav-btn" style="background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.3); color: #ef4444;" title="Sign Out">
                <i class="fa-solid fa-right-from-bracket"></i>
              </button>
            </div>
          `:`
            <button id="btn-header-auth" class="nav-btn" style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); color: #10b981; font-weight: 700;" title="Sign In or Create Account">
              <i class="fa-solid fa-user-check"></i>
              <span>Sign In</span>
            </button>
          `}

          <button id="btn-contact-card" class="nav-btn" style="background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); color: #f59e0b; font-size: 0.78rem; padding: 0.35rem 0.65rem; border-radius: 6px; font-weight: 600;" title="Contact Proprietor V. RAMANA">
            <i class="fa-solid fa-address-card"></i>
            <span class="btn-text-full">V. RAMANA (+91 80504 07710)</span>
            <span class="btn-text-mobile">V. RAMANA</span>
          </button>

          <button id="btn-theme-toggle" class="nav-btn" title="Toggle Light/Dark Theme">
            <i class="fa-solid ${e?"fa-sun":"fa-moon"}"></i>
            <span class="hide-mobile-small">${e?"Light":"Dark"}</span>
          </button>
        </div>
      </div>
    </header>
  `,(o=document.getElementById("btn-header-upload-prop"))==null||o.addEventListener("click",()=>{i?(r.setAdminTab("add-property"),r.openModal("admin-portal")):(r.pendingAdminTab="add-property",r.openModal("admin-portal"))}),(s=document.getElementById("btn-header-auth"))==null||s.addEventListener("click",()=>{r.openModal("auth-signin")}),(l=document.getElementById("btn-header-admin-portal"))==null||l.addEventListener("click",()=>{r.openModal("admin-portal")}),(t=document.getElementById("btn-user-logout"))==null||t.addEventListener("click",()=>{r.logout()}),(u=document.getElementById("btn-book-call"))==null||u.addEventListener("click",()=>{r.openModal("book-call")}),(c=document.getElementById("btn-contact-card"))==null||c.addEventListener("click",()=>{r.openModal("contact-us")}),(m=document.getElementById("btn-theme-toggle"))==null||m.addEventListener("click",()=>{r.toggleTheme()})}function te(){var i,o,s,l;const a=document.getElementById("hero-root");if(!a)return;const e=r.contactInfo;a.innerHTML=`
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-badge" style="background: linear-gradient(90deg, rgba(245,158,11,0.2), rgba(16,185,129,0.2)); border: 1px solid rgba(245,158,11,0.4); color: var(--text-primary); font-weight: 700;">
          <i class="fa-solid fa-crown" style="color: #f59e0b;"></i> ${e.slogan}
        </div>
        <h1 class="hero-title">
          Discover Verified <span>Rental Properties</span> in Bangalore
        </h1>
        <p class="hero-subtitle" style="margin-bottom: 1.25rem;">
          Directly managed by <strong>${e.proprietor} (${e.role})</strong> — Exclusively featuring verified Residential Rentals, Office Space Rentals & Godown Space Rentals across Bengaluru.
        </p>

        <!-- Hero Quick Place Search Bar -->
        <form id="hero-search-form" class="hero-search-box-wrapper">
          <i class="fa-solid fa-magnifying-glass-location" style="color: #10b981; font-size: 1.3rem;"></i>
          <input 
            type="text" 
            id="hero-place-search-input" 
            placeholder="Search place in Bangalore (e.g. Murugeshpalaya, Indiranagar, Bellandur)..." 
            value="${r.filters.searchQuery}"
            style="flex-grow: 1; background: transparent; border: none; outline: none; color: var(--text-primary); font-size: 0.95rem; font-weight: 500;"
          />
          <button type="submit" id="hero-place-search-btn" class="nav-btn nav-btn-primary hero-search-btn">
            Search Place
          </button>
        </form>

        <!-- Direct Proprietor Contact Banner -->
        <div class="hero-contact-card">
          <div class="hero-contact-info-block">
            <div style="width: 52px; height: 52px; border-radius: 50%; background: linear-gradient(135deg, #f59e0b, #d97706); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: #fff; flex-shrink: 0; box-shadow: 0 4px 12px rgba(245,158,11,0.4);">
              <i class="fa-solid fa-user-tie"></i>
            </div>
            <div>
              <div style="font-size: 1.25rem; font-weight: 800; color: #fff; letter-spacing: 0.5px;">${e.proprietor} <span style="font-size: 0.8rem; background: rgba(245,158,11,0.2); color: #f59e0b; padding: 2px 8px; border-radius: 4px; font-weight: 600; margin-left: 6px;">${e.role}</span></div>
              <div style="font-size: 0.85rem; color: #cbd5e1; margin-top: 2px;">
                <i class="fa-solid fa-location-dot" style="color: #f59e0b;"></i> ${e.address}
              </div>
            </div>
          </div>

          <div class="hero-action-buttons-group">
            <button id="hero-btn-book-call" class="nav-btn nav-btn-primary" style="font-weight: 700; padding: 0.65rem 1.2rem; border-radius: 10px;">
              <i class="fa-solid fa-phone-volume"></i> Book a Call
            </button>
            <a href="tel:${e.phoneRaw}" class="nav-btn" style="background: #10b981; color: #fff; font-weight: 700; border: none; padding: 0.65rem 1.2rem; border-radius: 10px;">
              <i class="fa-solid fa-phone"></i> ${e.phone}
            </a>
            <a href="https://wa.me/${e.whatsapp.replace("+","")}?text=Hello%20V.%20Ramana,%20I%20am%20interested%20in%20your%20properties%20in%20Bangalore." target="_blank" class="nav-btn" style="background: #25D366; color: #fff; font-weight: 700; border: none; padding: 0.65rem 1.2rem; border-radius: 10px;">
              <i class="fa-brands fa-whatsapp"></i> WhatsApp
            </a>
            <button id="hero-btn-view-card" class="nav-btn" style="background: rgba(245, 158, 11, 0.2); border: 1px solid #f59e0b; color: #f59e0b; font-weight: 700; padding: 0.65rem 1.2rem; border-radius: 10px;">
              <i class="fa-solid fa-id-card"></i> View Contact Card
            </button>
          </div>
        </div>
      </div>
    </section>
  `,(i=document.getElementById("hero-search-form"))==null||i.addEventListener("submit",t=>{var c;t.preventDefault();const u=(c=document.getElementById("hero-place-search-input"))==null?void 0:c.value;u!==void 0&&r.updateFilter("searchQuery",u)}),(o=document.getElementById("hero-place-search-input"))==null||o.addEventListener("input",t=>{r.updateFilter("searchQuery",t.target.value)}),(s=document.getElementById("hero-btn-book-call"))==null||s.addEventListener("click",()=>{r.openModal("book-call")}),(l=document.getElementById("hero-btn-view-card"))==null||l.addEventListener("click",()=>{r.openModal("contact-us")})}function ie(){var o,s,l;const a=document.getElementById("filters-root");if(!a)return;const e=r.filters;a.innerHTML=`
    <div class="filter-header">
      <div class="filter-title">
        <i class="fa-solid fa-sliders" style="color: var(--accent-emerald);"></i> Filters
      </div>
      <button id="btn-reset-all" class="btn-reset-filters">Reset All</button>
    </div>

    <!-- Search Place / Keyword -->
    <div class="filter-group">
      <label class="filter-label">Search Place / Keyword</label>
      <form id="filters-search-form" style="position: relative;">
        <input 
          type="text" 
          id="filter-search-input" 
          placeholder="e.g. Indiranagar, Murugeshpalaya, Penthouse..." 
          value="${e.searchQuery}"
          class="input-field-group"
          style="width: 100%; padding: 0.65rem 0.85rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary);"
        />
      </form>
    </div>

    <!-- BHK Configuration -->
    <div class="filter-group">
      <label class="filter-label">BHK Type</label>
      <div class="filter-pills">
        <button class="pill-btn ${e.bhk==="All"?"active":""}" data-bhk="All">All</button>
        <button class="pill-btn ${e.bhk==="1bhk"?"active":""}" data-bhk="1bhk">1 BHK</button>
        <button class="pill-btn ${e.bhk==="2bhk"?"active":""}" data-bhk="2bhk">2 BHK</button>
        <button class="pill-btn ${e.bhk==="3bhk"?"active":""}" data-bhk="3bhk">3 BHK</button>
        <button class="pill-btn ${e.bhk==="4bhk"?"active":""}" data-bhk="4bhk">4+ BHK</button>
      </div>
    </div>

    <!-- Rent Price Range Slider -->
    <div class="filter-group">
      <div class="range-slider-container">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <label class="filter-label" style="margin-bottom: 0;">Max Monthly Rent</label>
          <div class="range-value-display">₹${e.maxPrice.toLocaleString("en-IN")}/mo</div>
        </div>
        <input 
          type="range" 
          id="filter-price-slider" 
          min="15000" 
          max="150000" 
          step="5000" 
          value="${e.maxPrice}" 
          class="range-slider"
        />
        <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted);">
          <span>₹15,000</span>
          <span>₹1.5 Lakhs+</span>
        </div>
      </div>
    </div>

    <!-- Furnishing Status -->
    <div class="filter-group">
      <label class="filter-label">Furnishing</label>
      <div class="filter-pills">
        <button class="pill-btn ${e.furnishing==="All"?"active":""}" data-furnish="All">All</button>
        <button class="pill-btn ${e.furnishing==="Fully Furnished"?"active":""}" data-furnish="Fully Furnished">Full</button>
        <button class="pill-btn ${e.furnishing==="Semi-Furnished"?"active":""}" data-furnish="Semi-Furnished">Semi</button>
      </div>
    </div>
  `,(o=document.getElementById("btn-reset-all"))==null||o.addEventListener("click",()=>{r.resetFilters()}),(s=document.getElementById("filters-search-form"))==null||s.addEventListener("submit",t=>{var c;t.preventDefault();const u=(c=document.getElementById("filter-search-input"))==null?void 0:c.value;u!==void 0&&r.updateFilter("searchQuery",u)});const i=document.getElementById("filter-search-input");i==null||i.addEventListener("input",t=>{r.updateFilter("searchQuery",t.target.value)}),a.querySelectorAll("[data-bhk]").forEach(t=>{t.addEventListener("click",()=>{r.updateFilter("bhk",t.dataset.bhk)})}),a.querySelectorAll("[data-furnish]").forEach(t=>{t.addEventListener("click",()=>{r.updateFilter("furnishing",t.dataset.furnish)})}),(l=document.getElementById("filter-price-slider"))==null||l.addEventListener("input",t=>{r.updateFilter("maxPrice",Number(t.target.value))})}function ae(){var o,s,l;const a=document.getElementById("quick-bar-root"),e=document.getElementById("property-grid-root");if(!e)return;const i=r.filteredProperties.length;if(a&&(a.innerHTML=`
      <div class="results-count">
        Showing <span>${i}</span> Rental Properties in Bengaluru
      </div>

      <div class="sort-container">
        <label for="sort-select" style="font-size: 0.85rem; color: var(--text-secondary); font-weight: 600;">Sort By:</label>
        <select id="sort-select" class="sort-select">
          <option value="newest" ${r.sortBy==="newest"?"selected":""}>Newest Added</option>
          <option value="price-low" ${r.sortBy==="price-low"?"selected":""}>Price: Low to High</option>
          <option value="price-high" ${r.sortBy==="price-high"?"selected":""}>Price: High to Low</option>
        </select>
      </div>
    `,(o=document.getElementById("sort-select"))==null||o.addEventListener("change",t=>{r.setSortBy(t.target.value)})),i===0){const t=r.contactInfo,u=r.filters.searchQuery.trim()||(r.filters.locality!=="All"?r.filters.locality:""),c=u||"your selected search criteria",m=u?`Hello V. Ramana, I searched for rental properties in "${u}" on The Bangalore Properties website, but no active listings were displayed. Please send me available options for "${u}".`:"Hello V. Ramana, I am looking for rental properties in Bangalore with my specific requirements. Please share available options.",p=`https://wa.me/${t.whatsapp.replace("+","")}?text=${encodeURIComponent(m)}`;e.innerHTML=`
      <div class="empty-state-card">
        <div class="empty-state-icon">
          <i class="fa-solid fa-map-location-dot"></i>
        </div>

        <h3 class="font-heading empty-state-title">
          No Active Properties Listed for <span class="empty-state-highlight">"${c}"</span>
        </h3>
        
        <div class="empty-state-contact-box">
          <div class="empty-state-contact-title">
            <i class="fa-solid fa-handshake-angle"></i> Please Contact Us Directly!
          </div>
          <div class="empty-state-contact-desc">
            We have unlisted & upcoming residential flats, office spaces, and godowns available in <strong>${c}</strong>. Contact Proprietor <strong>${t.proprietor} (${t.phone})</strong> on WhatsApp or phone to get instant property options!
          </div>
        </div>

        <div class="empty-state-actions">
          <!-- WhatsApp Direct Button -->
          <a 
            href="${p}" 
            target="_blank" 
            class="nav-btn empty-state-btn empty-state-wa-btn" 
          >
            <i class="fa-brands fa-whatsapp empty-state-wa-icon"></i> <span>Chat on WhatsApp for "${c}"</span>
          </a>

          <!-- Book a Call Button -->
          <button id="btn-empty-book-call" class="nav-btn nav-btn-primary empty-state-btn">
            <i class="fa-solid fa-phone-volume"></i> <span>Book a Call</span>
          </button>

          <!-- Reset Filters Button -->
          <button id="btn-empty-reset" class="nav-btn empty-state-btn empty-state-reset-btn">
            <i class="fa-solid fa-rotate-left"></i> <span>View All Properties</span>
          </button>
        </div>
      </div>
    `,(s=document.getElementById("btn-empty-book-call"))==null||s.addEventListener("click",()=>{r.openModal("book-call")}),(l=document.getElementById("btn-empty-reset"))==null||l.addEventListener("click",()=>{r.resetFilters()});return}e.innerHTML=r.filteredProperties.map(t=>`
      <article class="property-card" data-id="${t.id}">
        <div class="card-image-wrapper">
          <img class="card-image" src="${t.images[0]}" alt="${t.title}" loading="lazy" />
          
          <div class="card-badges">
            <span class="badge" style="background: #10b981; color: #ffffff; font-weight: 800; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px;"><i class="fa-solid fa-key"></i> FOR RENT</span>
            ${t.isVerified?'<span class="badge badge-verified"><i class="fa-solid fa-shield-halved"></i> Verified</span>':""}
          </div>
        </div>

        <div class="card-content">
          <div class="card-price-row">
            <div class="card-price">
              ₹${t.price.toLocaleString("en-IN")} <span>/mo</span>
            </div>
            <div class="card-deposit">
              Dep: ₹${(t.deposit/1e3).toFixed(0)}k
            </div>
          </div>

          <h3 class="card-title" title="${t.title}">${t.title}</h3>
          
          <div class="card-locality">
            <i class="fa-solid fa-location-dot" style="color: var(--accent-emerald);"></i> ${t.locality}, Bengaluru
          </div>

          <div class="card-specs">
            <div class="spec-item">
              <i class="fa-solid fa-bed"></i> ${t.bhk}
            </div>
            <div class="spec-item">
              <i class="fa-solid fa-ruler-combined"></i> ${t.sqft} sq ft
            </div>
            <div class="spec-item">
              <i class="fa-solid fa-bath"></i> ${t.bathrooms} Bath
            </div>
            <div class="spec-item">
              <i class="fa-solid fa-couch"></i> ${t.furnishing.split(" ")[0]}
            </div>
          </div>

          <div class="card-actions">
            <button class="btn-card-secondary btn-view-details" data-prop-id="${t.id}">
              <i class="fa-solid fa-eye"></i> Details
            </button>
            <button class="btn-card-secondary btn-book-call-card" data-prop-id="${t.id}" style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); color: #10b981; font-weight: 700;">
              <i class="fa-solid fa-phone-volume"></i> Call
            </button>
            <button class="btn-card-primary btn-schedule-visit" data-prop-id="${t.id}">
              <i class="fa-solid fa-calendar-check"></i> Book Visit
            </button>
          </div>
        </div>
      </article>
    `).join(""),e.querySelectorAll(".btn-view-details").forEach(t=>{t.addEventListener("click",()=>{const u=t.dataset.propId,c=r.allProperties.find(m=>m.id===u);c&&r.openModal("property-details",c)})}),e.querySelectorAll(".btn-book-call-card").forEach(t=>{t.addEventListener("click",()=>{const u=t.dataset.propId,c=r.allProperties.find(m=>m.id===u);r.openModal("book-call",c)})}),e.querySelectorAll(".btn-schedule-visit").forEach(t=>{t.addEventListener("click",()=>{const u=t.dataset.propId,c=r.allProperties.find(m=>m.id===u);c&&r.openModal("schedule-visit",c)})})}function $(a,e="fa-circle-check"){const i=document.getElementById("toast-container");if(!i)return;const o=document.createElement("div");o.className="toast",o.innerHTML=`
    <i class="fa-solid ${e}" style="color: var(--accent-emerald); font-size: 1.2rem;"></i>
    <span>${a}</span>
  `,i.appendChild(o),setTimeout(()=>{o.style.opacity="0",o.style.transform="translateX(50px)",o.style.transition="all 0.3s ease",setTimeout(()=>{o.remove()},300)},4500)}function oe(){var s,l,t,u,c,m,p,n,d,f,b,v,P,T,N,_,O,j;const a=document.getElementById("modal-root");if(!a)return;if(!r.activeModal){a.innerHTML="";return}const e=r.activeProperty,i=typeof r.isAdmin=="function"?r.isAdmin():!1;if(r.activeModal==="property-details"&&e){a.innerHTML=`
      <div class="modal-overlay modal-overlay-details-fullscreen" id="modal-backdrop">
        <div class="modal-card modal-card-details-fullscreen">
          
          <!-- Sticky Fullscreen Top Navigation Bar -->
          <div class="details-fullscreen-topbar">
            <div class="details-fullscreen-topbar-left">
              <button type="button" class="details-back-btn" id="btn-back-details" title="Back to Properties">
                <i class="fa-solid fa-arrow-left"></i> <span>Back to Properties</span>
              </button>
              <div class="details-breadcrumb hide-mobile">
                <span>Bengaluru</span>
                <i class="fa-solid fa-chevron-right" style="font-size: 0.7rem; color: var(--text-muted);"></i>
                <span>${e.locality}</span>
                <i class="fa-solid fa-chevron-right" style="font-size: 0.7rem; color: var(--text-muted);"></i>
                <span style="font-weight: 700; color: var(--text-primary);">${e.title}</span>
              </div>
            </div>

            <div class="details-fullscreen-topbar-right">
              <div class="hide-mobile" style="text-align: right; margin-right: 0.5rem;">
                <div style="font-size: 1.25rem; font-weight: 800; color: var(--accent-emerald); line-height: 1;">
                  ₹${e.price.toLocaleString("en-IN")}<span style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 500;">/mo</span>
                </div>
                <div style="font-size: 0.72rem; color: var(--text-muted);">Dep: ₹${e.deposit.toLocaleString("en-IN")}</div>
              </div>
              ${i?`
                <button type="button" class="nav-btn details-edit-btn" id="btn-edit-details" style="background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; color: #10b981; font-weight: 700; padding: 0.55rem 0.95rem; font-size: 0.85rem; border-radius: 10px; cursor: pointer; display: inline-flex; align-items: center; gap: 0.45rem; text-decoration: none;" title="Edit Property Details (Admin Only)">
                  <i class="fa-solid fa-pen-to-square"></i> <span>Edit Property</span>
                </button>
              `:""}
              <a href="tel:${e.ownerPhone}" class="nav-btn nav-btn-primary hide-mobile" style="padding: 0.55rem 1rem; font-size: 0.85rem; border-radius: 10px; text-decoration: none;">
                <i class="fa-solid fa-phone"></i> Call Direct
              </a>
              <a href="https://wa.me/918050407710?text=${encodeURIComponent(`Hello V. Ramana, I am inquiring about "${e.title}" in ${e.locality} listed for ₹${e.price.toLocaleString("en-IN")}/mo on The Bangalore Properties.`)}" target="_blank" class="nav-btn hide-mobile" style="background: #25D366; color: #fff; border: none; padding: 0.55rem 1rem; font-size: 0.85rem; border-radius: 10px; text-decoration: none;">
                <i class="fa-brands fa-whatsapp"></i> WhatsApp
              </a>
              <button class="modal-close-btn" id="btn-close-modal" style="position: static !important; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.1); border: 1px solid var(--border-color); color: var(--text-primary); cursor: pointer;" title="Close Details">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>

          <!-- Fullscreen Scrollable Content Body -->
          <div class="details-fullscreen-body" id="details-scroll-container">
            <div class="details-fullscreen-container">

              <!-- Title & Price Header Banner -->
              <div class="details-main-header-card">
                <div style="flex: 1; min-width: 280px;">
                  <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.5rem; align-items: center;">
                    <span class="badge" style="background: #10b981; color: #fff; font-weight: 800; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px;"><i class="fa-solid fa-key"></i> FOR RENT</span>
                    ${e.isVerified?'<span class="badge badge-verified">🛡️ Verified Property</span>':""}
                    ${i?`
                      <button type="button" class="badge" id="btn-badge-edit-details" style="background: rgba(16, 185, 129, 0.18); border: 1px solid #10b981; color: #10b981; font-weight: 800; font-size: 0.75rem; cursor: pointer; display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.25rem 0.65rem; border-radius: 6px;" title="Edit Property Details (Admin Only)">
                        <i class="fa-solid fa-pen-to-square"></i> Edit Listing
                      </button>
                    `:""}
                  </div>
                  <h1 class="details-page-title font-heading">${e.title}</h1>
                  <div class="details-page-address">
                    <i class="fa-solid fa-location-dot" style="color: var(--accent-emerald);"></i> ${e.address}
                  </div>
                </div>

                <div class="details-header-price-card">
                  <div style="font-size: 2.2rem; font-weight: 800; color: var(--accent-emerald); line-height: 1.1;">
                    ₹${e.price.toLocaleString("en-IN")} <span style="font-size: 1.05rem; color: var(--text-secondary); font-weight: 500;">/month</span>
                  </div>
                  <div style="font-size: 0.95rem; color: var(--text-secondary); margin-top: 4px;">
                    Security Deposit: <strong style="color: var(--text-primary);">₹${e.deposit.toLocaleString("en-IN")}</strong>
                  </div>
                </div>
              </div>

              <!-- Main Photo Gallery Slider (Sideways Swipeable, No Arrows) -->
              <div class="gallery-slider-wrapper details-fullscreen-gallery">
                <div class="gallery-slider-track" id="property-gallery-slider">
                  ${e.images.map((w,k)=>`
                    <div class="gallery-slide-item" data-slide-index="${k}">
                      <div class="gallery-ambient-bg" style="background-image: url('${w}');" aria-hidden="true"></div>
                      <img class="gallery-main-img" src="${w}" alt="${e.title} - Photo ${k+1}" loading="${k===0?"eager":"lazy"}" />
                    </div>
                  `).join("")}
                </div>

                ${e.images.length>1?`
                  <div class="gallery-counter-pill" id="gallery-counter-pill">
                    <span id="gallery-active-index">1</span> / ${e.images.length}
                  </div>
                `:""}
              </div>

              <!-- Horizontally Scrollable Thumbnails Strip -->
              ${e.images.length>1?`
                <div class="gallery-thumbs-carousel" id="gallery-thumbs-carousel" style="margin-bottom: 2rem;">
                  ${e.images.map((w,k)=>`
                    <button 
                      type="button" 
                      class="gallery-thumb-btn ${k===0?"active":""}" 
                      data-thumb-index="${k}"
                      aria-label="View Photo ${k+1}"
                    >
                      <img src="${w}" alt="Thumbnail ${k+1}" loading="lazy" />
                    </button>
                  `).join("")}
                </div>
              `:""}

              <!-- 2-Column Responsive Layout: Left Content (68%) & Right Sticky Contact Widget (32%) -->
              <div class="details-2col-layout">
                
                <!-- Left Column: Specs, Description, Amenities, Proximity -->
                <div class="details-main-col">

                  <!-- Key Specs Matrix Bar (Balanced 4x2 Grid) -->
                  <div class="details-specs-grid">
                    <div class="details-spec-box">
                      <div class="details-spec-icon"><i class="fa-solid fa-bed"></i></div>
                      <div class="details-spec-content">
                        <div class="details-spec-label">BHK TYPE</div>
                        <div class="details-spec-val">${e.bhk}</div>
                      </div>
                    </div>
                    <div class="details-spec-box">
                      <div class="details-spec-icon"><i class="fa-solid fa-ruler-combined"></i></div>
                      <div class="details-spec-content">
                        <div class="details-spec-label">SUPER AREA</div>
                        <div class="details-spec-val">${e.sqft} sq ft</div>
                      </div>
                    </div>
                    <div class="details-spec-box">
                      <div class="details-spec-icon"><i class="fa-solid fa-couch"></i></div>
                      <div class="details-spec-content">
                        <div class="details-spec-label">FURNISHING</div>
                        <div class="details-spec-val">${e.furnishing}</div>
                      </div>
                    </div>
                    <div class="details-spec-box">
                      <div class="details-spec-icon"><i class="fa-solid fa-stairs"></i></div>
                      <div class="details-spec-content">
                        <div class="details-spec-label">FLOOR LEVEL</div>
                        <div class="details-spec-val">${e.floor}</div>
                      </div>
                    </div>
                    <div class="details-spec-box">
                      <div class="details-spec-icon"><i class="fa-solid fa-compass"></i></div>
                      <div class="details-spec-content">
                        <div class="details-spec-label">FACING</div>
                        <div class="details-spec-val">${e.facing}</div>
                      </div>
                    </div>
                    <div class="details-spec-box">
                      <div class="details-spec-icon"><i class="fa-solid fa-bath"></i></div>
                      <div class="details-spec-content">
                        <div class="details-spec-label">BATHROOMS</div>
                        <div class="details-spec-val">${e.bathrooms||2} Baths</div>
                      </div>
                    </div>
                    <div class="details-spec-box">
                      <div class="details-spec-icon"><i class="fa-solid fa-clock"></i></div>
                      <div class="details-spec-content">
                        <div class="details-spec-label">AVAILABLE FROM</div>
                        <div class="details-spec-val">${e.availableFrom||"Immediate"}</div>
                      </div>
                    </div>
                    <div class="details-spec-box">
                      <div class="details-spec-icon"><i class="fa-solid fa-users"></i></div>
                      <div class="details-spec-content">
                        <div class="details-spec-label">PREFERRED TENANTS</div>
                        <div class="details-spec-val">${e.preferredTenants||"Any"}</div>
                      </div>
                    </div>
                  </div>

                  <!-- Property Description Card -->
                  <div class="details-section-card">
                    <h3 class="details-section-heading">
                      <i class="fa-solid fa-circle-info" style="color: var(--accent-emerald);"></i> Property Overview & Description
                    </h3>
                    <p class="details-desc-text">${e.description}</p>
                  </div>

                  <!-- Society & Unit Amenities Card -->
                  <div class="details-section-card">
                    <h3 class="details-section-heading">
                      <i class="fa-solid fa-list-check" style="color: var(--accent-emerald);"></i> Society & Unit Amenities
                    </h3>
                    <div class="amenities-tag-grid">
                      ${e.amenities.map(w=>`
                        <span class="amenity-chip">
                          <i class="fa-solid fa-circle-check" style="color: var(--accent-emerald);"></i> ${w}
                        </span>
                      `).join("")}
                    </div>
                  </div>


                </div>

                <!-- Right Column: Sticky Contact & Booking Widget -->
                <div class="details-side-col">
                  <div class="details-sticky-contact-card">
                    <div class="details-contact-header">
                      <div style="font-size: 0.72rem; font-weight: 800; color: var(--accent-emerald); text-transform: uppercase; letter-spacing: 0.8px;">VERIFIED PROPRIETOR LISTING</div>
                      <div style="font-size: 1.2rem; font-weight: 800; color: var(--text-primary); margin-top: 2px;">
                        V. RAMANA <span style="font-size: 0.82rem; font-weight: 600; color: var(--text-secondary);">(Proprietor)</span>
                      </div>
                      <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 2px;">
                        The Bangalore Properties
                      </div>
                    </div>

                    <!-- Direct Actions Stack -->
                    <div class="details-contact-actions">
                      <a href="tel:${e.ownerPhone}" class="nav-btn nav-btn-primary" style="width: 100%; justify-content: center; padding: 0.85rem 1rem; font-size: 0.95rem; font-weight: 700; border-radius: 12px; gap: 0.5rem; text-decoration: none;">
                        <i class="fa-solid fa-phone"></i> Call Directly (${e.ownerPhone})
                      </a>

                      <a href="https://wa.me/918050407710?text=${encodeURIComponent(`Hello V. Ramana, I am inquiring about "${e.title}" in ${e.locality} listed for ₹${e.price.toLocaleString("en-IN")}/mo on The Bangalore Properties.`)}" target="_blank" class="nav-btn" style="width: 100%; justify-content: center; background: #25D366; color: #fff; font-weight: 800; padding: 0.85rem 1rem; font-size: 0.95rem; border-radius: 12px; border: none; text-decoration: none; gap: 0.5rem;">
                        <i class="fa-brands fa-whatsapp" style="font-size: 1.15rem;"></i> Chat on WhatsApp
                      </a>

                      <button type="button" id="btn-modal-book-call" class="nav-btn" style="width: 100%; justify-content: center; background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; color: #10b981; font-weight: 700; padding: 0.85rem 1rem; font-size: 0.92rem; border-radius: 12px;">
                        <i class="fa-solid fa-phone-volume"></i> Request a Callback
                      </button>

                      <button type="button" id="btn-modal-schedule-tour" class="nav-btn" style="width: 100%; justify-content: center; background: var(--accent-indigo); color: #fff; border: none; font-weight: 700; padding: 0.85rem 1rem; font-size: 0.92rem; border-radius: 12px;">
                        <i class="fa-solid fa-calendar-plus"></i> Schedule Property Visit
                      </button>

                      <button type="button" id="btn-side-edit-details" class="nav-btn" style="width: 100%; justify-content: center; background: rgba(16, 185, 129, 0.12); border: 1px solid #10b981; color: #10b981; font-weight: 700; padding: 0.85rem 1rem; font-size: 0.92rem; border-radius: 12px; margin-top: 0.35rem;">
                        <i class="fa-solid fa-pen-to-square"></i> Edit Property Details
                      </button>
                    </div>

                    <!-- Office Details Box -->
                    <div class="details-office-info-box">
                      <div style="font-size: 0.72rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">OFFICE LOCATION</div>
                      <div style="font-size: 0.82rem; color: var(--text-primary); line-height: 1.45; margin-top: 4px;">
                        Ground floor, Srinivas Residency, 2nd Main, KR Garden, Murugeshpalaya, Bangalore - 560017
                      </div>
                      <div style="margin-top: 8px; font-size: 0.78rem; color: var(--accent-emerald); font-weight: 700;">
                        <i class="fa-solid fa-handshake"></i> YOUR PROPERTY, OUR PRIORITY.
                      </div>
                    </div>

                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>
    `,(s=document.getElementById("btn-back-details"))==null||s.addEventListener("click",()=>{r.closeModal()});const g=document.getElementById("property-gallery-slider"),S=document.getElementById("gallery-active-index"),A=a.querySelectorAll(".gallery-thumb-btn");if(g){let w=!1,k=0,F=0;g.addEventListener("mousedown",h=>{w=!0,g.classList.add("is-dragging"),k=h.pageX-g.offsetLeft,F=g.scrollLeft}),window.addEventListener("mouseup",()=>{if(!w)return;w=!1,g.classList.remove("is-dragging");const h=g.clientWidth;if(h>0){const H=Math.round(g.scrollLeft/h);g.scrollTo({left:H*h,behavior:"smooth"})}}),g.addEventListener("mousemove",h=>{if(!w)return;h.preventDefault();const R=(h.pageX-g.offsetLeft-k)*1.5;g.scrollLeft=F-R});let E=0,y=0,x=0,I=0,z=!1;g.addEventListener("touchstart",h=>{!h.touches||h.touches.length===0||(E=h.touches[0].clientX,y=h.touches[0].clientY,x=Date.now(),I=0,z=!0)},{passive:!0}),g.addEventListener("touchmove",h=>{if(!z||!h.touches||h.touches.length===0)return;const H=h.touches[0].clientX,R=h.touches[0].clientY;I=H-E;const D=R-y;Math.abs(I)>Math.abs(D)&&Math.abs(I)>10&&h.cancelable&&h.preventDefault()},{passive:!1}),g.addEventListener("touchend",()=>{if(!z)return;z=!1;const h=g.clientWidth,R=Date.now()-x<300&&Math.abs(I)>20,D=Math.abs(I)>35;if(h>0&&(R||D)){const U=Math.round(g.scrollLeft/h);I<0&&U<e.images.length-1?g.scrollTo({left:(U+1)*h,behavior:"smooth"}):I>0&&U>0?g.scrollTo({left:(U-1)*h,behavior:"smooth"}):g.scrollTo({left:U*h,behavior:"smooth"})}},{passive:!0});let L;g.addEventListener("scroll",()=>{clearTimeout(L),L=setTimeout(()=>{const h=g.clientWidth;if(h<=0)return;const H=Math.round(g.scrollLeft/h);S&&(S.textContent=String(H+1)),A.forEach((R,D)=>{D===H?(R.classList.add("active"),R.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})):R.classList.remove("active")})},50)},{passive:!0}),A.forEach(h=>{h.addEventListener("click",H=>{H.preventDefault();const R=Number(h.dataset.thumbIndex),D=g.clientWidth;g.scrollTo({left:R*D,behavior:"smooth"})})})}(l=document.getElementById("btn-modal-book-call"))==null||l.addEventListener("click",()=>{r.openModal("book-call",e)}),(t=document.getElementById("btn-modal-schedule-tour"))==null||t.addEventListener("click",()=>{r.openModal("schedule-visit",e)});const B=w=>{if(w==null||w.preventDefault(),!i){$("🔒 Only administrators can edit properties.");return}r.openModal("edit-property",e)};(u=document.getElementById("btn-edit-details"))==null||u.addEventListener("click",B),(c=document.getElementById("btn-badge-edit-details"))==null||c.addEventListener("click",B),(m=document.getElementById("btn-side-edit-details"))==null||m.addEventListener("click",B)}else if(r.activeModal==="schedule-visit"&&e){const g=new Date().toISOString().split("T")[0];a.innerHTML=`
      <div class="modal-overlay" id="modal-backdrop">
        <div class="modal-card" style="max-width: 550px;">
          <button class="modal-close-btn" id="btn-close-modal">
            <i class="fa-solid fa-xmark"></i>
          </button>

          <div class="modal-body">
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
              <div style="width: 40px; height: 40px; border-radius: 10px; background: var(--accent-emerald-light); color: var(--accent-emerald); display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
                <i class="fa-solid fa-calendar-check"></i>
              </div>
              <div>
                <h3 class="font-heading" style="font-size: 1.4rem;">Schedule Property Tour</h3>
                <p style="font-size: 0.85rem; color: var(--text-secondary);">${e.title}</p>
              </div>
            </div>

            <form id="form-schedule-visit" style="display: flex; flex-direction: column; gap: 1.25rem;">
              <div class="input-field-group">
                <label>Select Tour Date</label>
                <input type="date" id="visit-date" min="${g}" value="${g}" required />
              </div>

              <div class="input-field-group">
                <label>Preferred Time Slot</label>
                <div class="filter-pills" id="time-slot-pills">
                  <button type="button" class="pill-btn active" data-slot="10:00 AM">10:00 AM</button>
                  <button type="button" class="pill-btn" data-slot="02:00 PM">02:00 PM</button>
                  <button type="button" class="pill-btn" data-slot="05:00 PM">05:00 PM</button>
                  <button type="button" class="pill-btn" data-slot="07:00 PM">07:00 PM</button>
                </div>
              </div>

              <div class="input-field-group">
                <label>Your Full Name</label>
                <input type="text" id="visit-name" placeholder="e.g. Rahul Sharma" required />
              </div>

              <div class="input-field-group">
                <label>Mobile Number (for Visit Confirmation SMS)</label>
                <input type="tel" id="visit-phone" placeholder="+91 98765 43210" required />
              </div>

              <button type="submit" class="nav-btn nav-btn-primary" style="width: 100%; justify-content: center; padding: 0.9rem; font-size: 1rem; margin-top: 0.5rem;">
                <i class="fa-solid fa-circle-check"></i> Confirm Visit Appointment
              </button>
            </form>
          </div>
        </div>
      </div>
    `;let S="10:00 AM";a.querySelectorAll("#time-slot-pills .pill-btn").forEach(A=>{A.addEventListener("click",()=>{a.querySelectorAll("#time-slot-pills .pill-btn").forEach(B=>B.classList.remove("active")),A.classList.add("active"),S=A.dataset.slot})}),(p=document.getElementById("form-schedule-visit"))==null||p.addEventListener("submit",A=>{A.preventDefault();const B=document.getElementById("visit-date").value,w=document.getElementById("visit-name").value,k=document.getElementById("visit-phone").value;r.addLead({tenantName:w,tenantPhone:k,propertyId:e.id,propertyTitle:e.title,locality:e.locality,date:B,status:"New",notes:`Property tour booked for ${B} at ${S}. Property: ${e.title} (${e.locality})`}),r.closeModal(),$(`🎉 Tour Confirmed for ${w}! Appointment scheduled for ${B} at ${S}. Confirmation SMS sent to ${k}.`)})}else if(r.activeModal==="contact-us"){const g=r.contactInfo;a.innerHTML=`
      <div class="modal-overlay" id="modal-backdrop">
        <div class="modal-card" style="max-width: 680px; width: 94vw; max-height: 90vh; max-height: 90dvh; overflow-y: auto; overflow-x: hidden; background: #0b0f19; border: 2px solid rgba(245, 158, 11, 0.5); box-shadow: 0 25px 60px rgba(0,0,0,0.85); padding: 0; border-radius: 20px; box-sizing: border-box;">
          <button class="modal-close-btn" id="btn-close-modal" style="top: 10px; right: 10px; background: rgba(0,0,0,0.7); color: #fff; border: 1px solid rgba(255,255,255,0.25); z-index: 20; width: 34px; height: 34px;">
            <i class="fa-solid fa-xmark"></i>
          </button>

          <!-- Digital Business Card UI Header -->
          <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-bottom: 2px solid #f59e0b; position: relative;">
            <!-- Gold Trim Curved Header -->
            <div style="background: linear-gradient(90deg, #d97706, #f59e0b, #fbbf24); padding: 0.75rem 3.5rem 0.75rem 1rem; text-align: center; color: #0b0f19; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; font-size: 0.8rem; box-shadow: 0 4px 12px rgba(0,0,0,0.3); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              <i class="fa-solid fa-building-circle-check"></i> Official Business Contact Card
            </div>

            <!-- Top Front Banner (Matching Business Card Image) -->
            <div style="padding: 1.25rem 1.25rem 1rem 1.25rem; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; border-bottom: 1px dashed rgba(245,158,11,0.3);">
              <div style="display: flex; align-items: center; gap: 0.85rem; min-width: 0;">
                <div style="width: 50px; height: 50px; border-radius: 14px; background: linear-gradient(135deg, #f59e0b, #b45309); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.7rem; flex-shrink: 0; box-shadow: 0 6px 16px rgba(245,158,11,0.4);">
                  <i class="fa-solid fa-city"></i>
                </div>
                <div style="min-width: 0;">
                  <div style="font-family: 'Outfit', sans-serif; font-size: 1.4rem; font-weight: 800; color: #ffffff; line-height: 1.15; letter-spacing: -0.3px; word-break: break-word;">
                    The Bangalore <span style="color: #f59e0b;">Properties</span>
                  </div>
                  <div style="font-size: 0.65rem; font-weight: 700; color: #94a3b8; letter-spacing: 0.5px; margin-top: 4px; line-height: 1.3;">
                    RENT • LEASE • SALE • OFFICE • GODOWN
                  </div>
                </div>
              </div>

              <!-- Top Right Highlight -->
              <div style="background: rgba(245,158,11,0.15); border: 1px solid #f59e0b; padding: 0.65rem 1rem; border-radius: 12px; text-align: left; flex: 1; min-width: 170px;">
                <div style="font-size: 1.15rem; font-weight: 900; color: #ffffff; font-family: 'Outfit', sans-serif;">${g.proprietor}</div>
                <div style="font-size: 0.9rem; font-weight: 700; color: #f59e0b; white-space: nowrap;">
                  <i class="fa-solid fa-phone"></i> ${g.phone}
                </div>
              </div>
            </div>

            <!-- Card Bottom Banner with Slogan (Matching Business Card Image) -->
            <div style="background: linear-gradient(90deg, #0f172a, #1e1b4b); padding: 0.85rem 1.25rem; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.1);">
              <div style="font-size: 0.78rem; color: #cbd5e1;">
                <span style="color: #f59e0b; font-weight: 700;">PROPRIETOR:</span> ${g.proprietor}
              </div>
              <div style="font-family: 'Outfit', sans-serif; font-size: 0.95rem; font-weight: 900; color: #fbbf24; letter-spacing: 0.5px; text-shadow: 0 0 10px rgba(245,158,11,0.5);">
                YOUR PROPERTY, OUR PRIORITY.
              </div>
            </div>
          </div>

          <!-- Business Card Details Body -->
          <div style="padding: 1.25rem; background: #0f172a;">
            <div style="display: flex; flex-direction: column; gap: 0.85rem; margin-bottom: 1.25rem;">

              <div class="contact-detail-row">
                <div style="width: 42px; height: 42px; border-radius: 10px; background: rgba(245,158,11,0.15); color: #f59e0b; display: flex; align-items: center; justify-content: center; font-size: 1.15rem; flex-shrink: 0;">
                  <i class="fa-solid fa-user-tie"></i>
                </div>
                <div style="flex: 1; min-width: 0;">
                  <div style="font-size: 0.72rem; color: #94a3b8; font-weight: 600;">CONTACT PERSON</div>
                  <div style="font-size: 1rem; font-weight: 800; color: #f8fafc;">${g.proprietor} (${g.role})</div>
                </div>
              </div>

              <div class="contact-detail-row">
                <div style="width: 42px; height: 42px; border-radius: 10px; background: rgba(37,211,102,0.15); color: #25D366; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; flex-shrink: 0;">
                  <i class="fa-brands fa-whatsapp"></i>
                </div>
                <div style="flex: 1; min-width: 140px;">
                  <div style="font-size: 0.72rem; color: #94a3b8; font-weight: 600;">WHATSAPP & PHONE</div>
                  <div style="font-size: 1.05rem; font-weight: 800; color: #f8fafc; white-space: nowrap;">${g.phone}</div>
                </div>
                <a href="https://wa.me/${g.whatsapp.replace("+","")}?text=Hello%20V.%20Ramana,%20I%20want%20to%20inquire%20about%20properties%20in%20Bangalore." target="_blank" class="nav-btn" style="background: #25D366; color: #fff; border: none; font-weight: 800; padding: 0.5rem 0.85rem; font-size: 0.82rem; border-radius: 10px; flex-shrink: 0; white-space: nowrap;">
                  <i class="fa-brands fa-whatsapp"></i> WhatsApp
                </a>
              </div>

              <div class="contact-detail-row">
                <div style="width: 42px; height: 42px; border-radius: 10px; background: rgba(239,68,68,0.15); color: #ef4444; display: flex; align-items: center; justify-content: center; font-size: 1.15rem; flex-shrink: 0;">
                  <i class="fa-solid fa-envelope"></i>
                </div>
                <div style="flex: 1; min-width: 140px;">
                  <div style="font-size: 0.72rem; color: #94a3b8; font-weight: 600;">EMAIL ADDRESS</div>
                  <div style="font-size: 0.9rem; font-weight: 700; color: #f8fafc; word-break: break-all;">${g.email}</div>
                </div>
                <a href="mailto:${g.email}" class="nav-btn" style="background: rgba(239,68,68,0.2); color: #ef4444; border: 1px solid #ef4444; padding: 0.45rem 0.8rem; font-size: 0.82rem; flex-shrink: 0; white-space: nowrap;">
                  Email Us
                </a>
              </div>

              <div class="contact-detail-row" style="align-items: flex-start;">
                <div style="width: 42px; height: 42px; border-radius: 10px; background: rgba(99,102,241,0.15); color: #6366f1; display: flex; align-items: center; justify-content: center; font-size: 1.15rem; flex-shrink: 0; margin-top: 2px;">
                  <i class="fa-solid fa-location-dot"></i>
                </div>
                <div style="flex: 1; min-width: 0;">
                  <div style="font-size: 0.72rem; color: #94a3b8; font-weight: 600;">OFFICE ADDRESS</div>
                  <div style="font-size: 0.88rem; font-weight: 700; color: #f8fafc; line-height: 1.45; margin-top: 2px;">
                    Ground floor, Srinivas Residency,<br/>
                    2nd Main, KR Garden, Murugeshpalaya,<br/>
                    Bangalore - 560017
                  </div>
                </div>
              </div>

            </div>

            <!-- Services Offered Bottom Strip -->
            <div style="background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.3); padding: 0.75rem; border-radius: 12px; text-align: center; margin-bottom: 1rem;">
              <div style="font-size: 0.68rem; font-weight: 800; color: #f59e0b; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px;">PROPERTY SERVICES OFFERED</div>
              <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 0.4rem;">
                ${g.services.map(S=>`
                  <span style="background: rgba(0,0,0,0.4); color: #fff; font-size: 0.72rem; font-weight: 700; padding: 3px 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1);">
                    ${S}
                  </span>
                `).join("")}
              </div>
            </div>

            <!-- Quick Buttons -->
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
              <a href="https://wa.me/${g.whatsapp.replace("+","")}?text=Hello%20V.%20Ramana,%20I%20got%20your%20contact%20card%20and%20I%20want%20to%20inquire%20about%20properties%20in%20Bangalore." target="_blank" class="nav-btn" style="flex: 1; min-width: 140px; background: #25D366; color: #fff; font-weight: 800; justify-content: center; padding: 0.8rem;">
                <i class="fa-brands fa-whatsapp"></i> Chat on WhatsApp
              </a>
              <button id="btn-copy-card-details" class="nav-btn" style="flex: 1; min-width: 140px; background: rgba(255,255,255,0.1); color: #fff; border: 1px solid var(--border-color); font-weight: 700; justify-content: center; padding: 0.8rem;">
                <i class="fa-solid fa-copy"></i> Copy Details
              </button>
            </div>
          </div>
        </div>
      </div>
    `,(n=document.getElementById("btn-copy-card-details"))==null||n.addEventListener("click",()=>{navigator.clipboard.writeText(`The Bangalore Properties
Proprietor: V. RAMANA
Phone: +91 80504 07710
Email: ramuramana92@gmail.com
Address: Ground floor, Srinivas Residency, 2nd Main, KR Garden, Murugeshpalaya, Bangalore - 560017
Slogan: YOUR PROPERTY, OUR PRIORITY.
Services: Rent, Lease, Sale, Office Space, Godown Space, etc.`).then(()=>{$("📋 Contact details copied to clipboard!")}).catch(()=>{$("📋 V. RAMANA (+91 80504 07710)")})})}else if(r.activeModal==="book-call"){const g=new Date().toISOString().split("T")[0],S=r.contactInfo;a.innerHTML=`
      <div class="modal-overlay" id="modal-backdrop">
        <div class="modal-card modal-card-book-call" style="max-width: 580px; width: 94vw; max-height: 90vh; max-height: 90dvh; display: flex; flex-direction: column; overflow: hidden; background: #0f172a; border: 2px solid rgba(16, 185, 129, 0.5); box-shadow: 0 25px 60px rgba(0,0,0,0.85); border-radius: 20px; box-sizing: border-box;">
          
          <!-- Sticky Pinned Modal Header -->
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 1.15rem 1.35rem; border-bottom: 1px solid rgba(255,255,255,0.1); background: #0f172a; flex-shrink: 0; border-top-left-radius: 18px; border-top-right-radius: 18px;">
            <div style="display: flex; align-items: center; gap: 0.75rem; min-width: 0; flex: 1;">
              <div style="width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, #10b981, #059669); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);">
                <i class="fa-solid fa-phone-volume"></i>
              </div>
              <div style="min-width: 0; flex: 1;">
                <h3 class="font-heading" style="font-size: 1.2rem; color: #fff; line-height: 1.2; margin: 0;">Book a Callback</h3>
                <p style="font-size: 0.78rem; color: #10b981; font-weight: 700; margin: 2px 0 0 0;">
                  With Proprietor ${S.proprietor} (${S.phone})
                </p>
              </div>
            </div>

            <button class="modal-close-btn" id="btn-close-modal" style="position: static !important; width: 34px; height: 34px; background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2); flex-shrink: 0; margin-left: 0.75rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease;" title="Close Modal">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <!-- Scrollable Body Container -->
          <div class="modal-body" style="flex: 1 1 0%; min-height: 0; overflow-y: auto; -webkit-overflow-scrolling: touch; touch-action: pan-y; padding: 1.25rem 1.35rem 2rem 1.35rem; box-sizing: border-box;">
            <form id="form-book-call" style="display: flex; flex-direction: column; gap: 1rem;">
              <div class="modal-grid-2col">
                <div class="input-field-group">
                  <label style="font-weight: 700; color: #e2e8f0; font-size: 0.85rem; margin-bottom: 0.35rem;">Your Full Name *</label>
                  <input type="text" id="book-call-name" placeholder="e.g. Anand Sharma" required style="background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); color: #fff; padding: 0.75rem; border-radius: 10px; font-size: 0.92rem; width: 100%; box-sizing: border-box;" />
                </div>
                <div class="input-field-group">
                  <label style="font-weight: 700; color: #e2e8f0; font-size: 0.85rem; margin-bottom: 0.35rem;">Mobile Number *</label>
                  <input type="tel" id="book-call-phone" placeholder="+91 98765 43210" required style="background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); color: #fff; padding: 0.75rem; border-radius: 10px; font-size: 0.92rem; width: 100%; box-sizing: border-box;" />
                </div>
              </div>

              <div class="modal-grid-2col">
                <div class="input-field-group">
                  <label style="font-weight: 700; color: #e2e8f0; font-size: 0.85rem; margin-bottom: 0.35rem;">Preferred Service</label>
                  <select id="book-call-service" style="background: rgba(15,23,42,0.95); border: 1px solid var(--border-color); color: #fff; padding: 0.75rem; border-radius: 10px; font-size: 0.92rem; width: 100%; box-sizing: border-box;">
                    <option value="Residential Rental">Residential Rental (Flat/House)</option>
                    <option value="Commercial Office Space">Commercial Office Space</option>
                    <option value="Godown / Warehouse">Godown / Warehouse Space</option>
                    <option value="Long Term Lease">Long Term Lease</option>
                    <option value="General Property Consultation">General Property Consultation</option>
                  </select>
                </div>
                <div class="input-field-group">
                  <label style="font-weight: 700; color: #e2e8f0; font-size: 0.85rem; margin-bottom: 0.35rem;">Preferred Locality</label>
                  <input type="text" id="book-call-locality" placeholder="e.g. Murugeshpalaya, Indiranagar" style="background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); color: #fff; padding: 0.75rem; border-radius: 10px; font-size: 0.92rem; width: 100%; box-sizing: border-box;" />
                </div>
              </div>

              <div class="modal-grid-2col">
                <div class="input-field-group">
                  <label style="font-weight: 700; color: #e2e8f0; font-size: 0.85rem; margin-bottom: 0.35rem;">Preferred Call Date *</label>
                  <input type="date" id="book-call-date" min="${g}" value="${g}" required style="background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); color: #fff; padding: 0.75rem; border-radius: 10px; font-size: 0.92rem; width: 100%; box-sizing: border-box;" />
                </div>
                <div class="input-field-group">
                  <label style="font-weight: 700; color: #e2e8f0; font-size: 0.85rem; margin-bottom: 0.35rem;">Preferred Time Slot</label>
                  <select id="book-call-slot" style="background: rgba(15,23,42,0.95); border: 1px solid var(--border-color); color: #fff; padding: 0.75rem; border-radius: 10px; font-size: 0.92rem; width: 100%; box-sizing: border-box;">
                    <option value="Morning (09:00 AM - 12:00 PM)">Morning (09:00 AM - 12:00 PM)</option>
                    <option value="Afternoon (12:00 PM - 04:00 PM)">Afternoon (12:00 PM - 04:00 PM)</option>
                    <option value="Evening (04:00 PM - 08:00 PM)">Evening (04:00 PM - 08:00 PM)</option>
                  </select>
                </div>
              </div>

              <div class="input-field-group">
                <label style="font-weight: 700; color: #e2e8f0; font-size: 0.85rem; margin-bottom: 0.35rem;">Notes / Requirements (Optional)</label>
                <textarea id="book-call-notes" rows="2" placeholder="e.g. Budget ₹30k - ₹40k, 2BHK furnished near Tech Park..." style="background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); color: #fff; padding: 0.75rem; border-radius: 10px; resize: vertical; font-size: 0.92rem; width: 100%; box-sizing: border-box;"></textarea>
              </div>

              <!-- Full-Width Responsive Action Buttons (Never Cut Off) -->
              <div class="book-call-action-btns" style="display: flex; flex-direction: column; gap: 0.65rem; margin-top: 0.75rem; padding-bottom: 0.5rem;">
                <button type="submit" class="nav-btn nav-btn-primary" style="width: 100%; justify-content: center; padding: 0.9rem 1rem; font-size: 0.98rem; font-weight: 800; border-radius: 12px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35); display: flex; align-items: center; gap: 0.5rem; text-align: center;">
                  <i class="fa-solid fa-phone-volume"></i> Confirm & Book Callback
                </button>
                <a href="https://wa.me/${S.whatsapp.replace("+","")}?text=Hello%20V.%20Ramana,%20I%20would%20like%20to%20book%20a%20call%20regarding%20properties." target="_blank" class="nav-btn" style="width: 100%; justify-content: center; background: #25D366; color: #fff; font-weight: 800; padding: 0.85rem 1rem; font-size: 0.95rem; border-radius: 12px; border: none; text-decoration: none; display: flex; align-items: center; gap: 0.5rem; box-shadow: 0 4px 14px rgba(37, 211, 102, 0.3); text-align: center;">
                  <i class="fa-brands fa-whatsapp" style="font-size: 1.2rem;"></i> Chat on WhatsApp
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    `,(d=document.getElementById("form-book-call"))==null||d.addEventListener("submit",A=>{A.preventDefault();const B=document.getElementById("book-call-name").value.trim(),w=document.getElementById("book-call-phone").value.trim(),k=document.getElementById("book-call-service").value,F=document.getElementById("book-call-locality").value.trim()||"Bangalore",E=document.getElementById("book-call-date").value,y=document.getElementById("book-call-slot").value,x=document.getElementById("book-call-notes").value.trim();r.addLead({tenantName:B,tenantPhone:w,propertyTitle:`Booked Call: ${k}`,locality:F,date:E,notes:`Call Scheduled for ${E} [${y}]. Service: ${k}. ${x?"Notes: "+x:""}`}),r.closeModal(),$(`📞 Call Request Booked! Proprietor ${S.proprietor} will contact ${B} on ${E} (${y}).`);const I=`Hello V. Ramana, I have requested a callback on ${E} (${y}) regarding ${k} in ${F}.
Name: ${B}
Phone: ${w}${x?`
Note: `+x:""}`;window.open(`https://wa.me/${S.whatsapp.replace("+","")}?text=${encodeURIComponent(I)}`,"_blank")})}else if(r.activeModal==="edit-property"&&e){let w=function(){if(A){if(B&&(B.textContent=String(g.length)),g.length===0){A.innerHTML='<div style="font-size: 0.82rem; color: var(--text-muted); font-style: italic;">No photos yet. Please add at least one photo below.</div>';return}A.innerHTML=g.map((E,y)=>`
        <div style="position: relative; width: 88px; height: 88px; border-radius: 12px; overflow: hidden; border: 2px solid rgba(16, 185, 129, 0.4); flex-shrink: 0;">
          <img src="${E}" style="width: 100%; height: 100%; object-fit: cover;" />
          <button type="button" class="btn-remove-edit-img" data-img-idx="${y}" style="position: absolute; top: 4px; right: 4px; width: 24px; height: 24px; border-radius: 50%; background: #ef4444; color: #fff; border: 1.5px solid #fff; font-size: 0.75rem; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.5); z-index: 10;" title="Delete Photo">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      `).join(""),A.querySelectorAll("[data-img-idx]").forEach(E=>{E.addEventListener("click",y=>{y.preventDefault(),y.stopPropagation();const x=Number(E.dataset.imgIdx);g.splice(x,1),w()})})}};var o=w;if(!i){r.openModal("property-details",e),$("🔒 Access restricted: Only administrators can edit properties.");return}let g=Array.isArray(e.images)&&e.images.length>0?[...e.images]:[];a.innerHTML=`
      <div class="modal-overlay modal-overlay-details-fullscreen" id="modal-backdrop" style="background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(12px); overflow-y: auto; padding: 1.5rem 1rem; display: flex; align-items: center; justify-content: center;">
        <div class="modal-card edit-modal-card" style="max-width: 840px; width: 100%; max-height: 92vh; margin: auto; background: var(--bg-surface); border-radius: 20px; border: 1px solid var(--border-color); box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6); overflow: hidden; display: flex; flex-direction: column;">
          
          <!-- Sticky Top Header -->
          <div style="background: var(--bg-surface); border-bottom: 1px solid var(--border-color); padding: 1.15rem 1.5rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-shrink: 0;">
            <div style="display: flex; align-items: center; gap: 0.85rem;">
              <button type="button" class="details-back-btn" id="btn-back-from-edit" style="padding: 0.45rem 0.85rem; font-size: 0.82rem;">
                <i class="fa-solid fa-arrow-left"></i> <span>Back to Details</span>
              </button>
              <div>
                <h3 class="font-heading" style="margin: 0; font-size: 1.25rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.45rem;">
                  <i class="fa-solid fa-pen-to-square" style="color: var(--accent-emerald);"></i> Edit Property Details
                </h3>
                <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 2px;">
                  Editing: <strong style="color: var(--text-primary);">${e.title}</strong> (${e.locality})
                </div>
              </div>
            </div>
            <button class="modal-close-btn" id="btn-close-edit" style="position: static !important; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.08); border: 1px solid var(--border-color); color: var(--text-primary); cursor: pointer;" title="Close Edit">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <!-- Scrollable Edit Form Body -->
          <div style="flex: 1 1 0%; min-height: 0; overflow-y: auto; -webkit-overflow-scrolling: touch; padding: 1.5rem 1.75rem 2.5rem 1.75rem; box-sizing: border-box;">
            <form id="form-edit-property" style="display: flex; flex-direction: column; gap: 1.25rem;">
              
              <!-- Title & Locality -->
              <div class="modal-grid-2col">
                <div class="input-field-group">
                  <label style="font-weight: 700; color: var(--text-primary); font-size: 0.85rem; margin-bottom: 0.35rem; display: block;">Property Title *</label>
                  <input type="text" id="edit-p-title" value="${e.title?e.title.replace(/"/g,"&quot;"):""}" required style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.92rem; box-sizing: border-box;" />
                </div>
                <div class="input-field-group">
                  <label style="font-weight: 700; color: var(--text-primary); font-size: 0.85rem; margin-bottom: 0.35rem; display: block;">Locality / Area *</label>
                  <input type="text" id="edit-p-locality" value="${e.locality?e.locality.replace(/"/g,"&quot;"):""}" list="edit-localities-datalist" required style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.92rem; box-sizing: border-box;" />
                  <datalist id="edit-localities-datalist">
                    <option value="Murugeshpalaya"></option>
                    <option value="Indiranagar"></option>
                    <option value="Koramangala"></option>
                    <option value="Whitefield"></option>
                    <option value="HSR Layout"></option>
                    <option value="Domlur"></option>
                    <option value="HAL"></option>
                    <option value="Marathahalli"></option>
                    <option value="Old Airport Road"></option>
                    <option value="Bellandur"></option>
                    <option value="Electronic City"></option>
                    <option value="JP Nagar"></option>
                    <option value="Jayanagar"></option>
                    <option value="BTM Layout"></option>
                    <option value="Hebbal"></option>
                    <option value="Sarjapur Road"></option>
                  </datalist>
                </div>
              </div>

              <!-- Address -->
              <div class="input-field-group">
                <label style="font-weight: 700; color: var(--text-primary); font-size: 0.85rem; margin-bottom: 0.35rem; display: block;">Full Address *</label>
                <input type="text" id="edit-p-address" value="${e.address?e.address.replace(/"/g,"&quot;"):""}" required style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.92rem; box-sizing: border-box;" />
              </div>

              <!-- Rent, Deposit, BHK, Super Area -->
              <div class="modal-grid-2col">
                <div class="input-field-group">
                  <label style="font-weight: 700; color: var(--text-primary); font-size: 0.85rem; margin-bottom: 0.35rem; display: block;">Monthly Rent (₹) *</label>
                  <input type="number" id="edit-p-price" value="${e.price}" min="1000" step="500" required style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.92rem; box-sizing: border-box;" />
                </div>
                <div class="input-field-group">
                  <label style="font-weight: 700; color: var(--text-primary); font-size: 0.85rem; margin-bottom: 0.35rem; display: block;">Security Deposit (₹) *</label>
                  <input type="number" id="edit-p-deposit" value="${e.deposit}" min="1000" step="1000" required style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.92rem; box-sizing: border-box;" />
                </div>
              </div>

              <div class="modal-grid-2col">
                <div class="input-field-group">
                  <label style="font-weight: 700; color: var(--text-primary); font-size: 0.85rem; margin-bottom: 0.35rem; display: block;">BHK Type *</label>
                  <select id="edit-p-bhk" style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.92rem; box-sizing: border-box;">
                    <option value="1 BHK" ${e.bhk==="1 BHK"?"selected":""}>1 BHK</option>
                    <option value="2 BHK" ${e.bhk==="2 BHK"||(f=e.bhk)!=null&&f.includes("2")?"selected":""}>2 BHK</option>
                    <option value="3 BHK" ${e.bhk==="3 BHK"||(b=e.bhk)!=null&&b.includes("3")?"selected":""}>3 BHK</option>
                    <option value="4+ BHK" ${e.bhk==="4+ BHK"||(v=e.bhk)!=null&&v.includes("4")?"selected":""}>4+ BHK / Villa</option>
                  </select>
                </div>
                <div class="input-field-group">
                  <label style="font-weight: 700; color: var(--text-primary); font-size: 0.85rem; margin-bottom: 0.35rem; display: block;">Super Area (sq ft) *</label>
                  <input type="number" id="edit-p-sqft" value="${e.sqft}" min="50" step="10" required style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.92rem; box-sizing: border-box;" />
                </div>
              </div>

              <!-- Furnishing, Floor, Facing, Bathrooms -->
              <div class="modal-grid-2col">
                <div class="input-field-group">
                  <label style="font-weight: 700; color: var(--text-primary); font-size: 0.85rem; margin-bottom: 0.35rem; display: block;">Furnishing *</label>
                  <select id="edit-p-furnishing" style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.92rem; box-sizing: border-box;">
                    <option value="Semi-Furnished" ${e.furnishing==="Semi-Furnished"?"selected":""}>Semi-Furnished</option>
                    <option value="Fully Furnished" ${e.furnishing==="Fully Furnished"?"selected":""}>Fully Furnished</option>
                    <option value="Unfurnished" ${e.furnishing==="Unfurnished"?"selected":""}>Unfurnished</option>
                  </select>
                </div>
                <div class="input-field-group">
                  <label style="font-weight: 700; color: var(--text-primary); font-size: 0.85rem; margin-bottom: 0.35rem; display: block;">Floor Level *</label>
                  <input type="text" id="edit-p-floor" value="${e.floor?e.floor.replace(/"/g,"&quot;"):"Ground Floor"}" list="edit-floor-datalist" required style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.92rem; box-sizing: border-box;" />
                  <datalist id="edit-floor-datalist">
                    <option value="Ground Floor"></option>
                    <option value="1st Floor"></option>
                    <option value="2nd Floor"></option>
                    <option value="3rd Floor"></option>
                    <option value="3rd of 8"></option>
                    <option value="4th Floor"></option>
                    <option value="5th Floor"></option>
                    <option value="Top Floor / Penthouse"></option>
                  </datalist>
                </div>
              </div>

              <div class="modal-grid-2col">
                <div class="input-field-group">
                  <label style="font-weight: 700; color: var(--text-primary); font-size: 0.85rem; margin-bottom: 0.35rem; display: block;">Facing (Direction)</label>
                  <select id="edit-p-facing" style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.92rem; box-sizing: border-box;">
                    <option value="East Facing" ${e.facing==="East Facing"?"selected":""}>East Facing</option>
                    <option value="North Facing" ${e.facing==="North Facing"?"selected":""}>North Facing</option>
                    <option value="North-East Facing" ${e.facing==="North-East Facing"?"selected":""}>North-East Facing</option>
                    <option value="West Facing" ${e.facing==="West Facing"?"selected":""}>West Facing</option>
                    <option value="South Facing" ${e.facing==="South Facing"?"selected":""}>South Facing</option>
                    <option value="South-East Facing" ${e.facing==="South-East Facing"?"selected":""}>South-East Facing</option>
                    <option value="North-West Facing" ${e.facing==="North-West Facing"?"selected":""}>North-West Facing</option>
                    <option value="South-West Facing" ${e.facing==="South-West Facing"?"selected":""}>South-West Facing</option>
                  </select>
                </div>
                <div class="input-field-group">
                  <label style="font-weight: 700; color: var(--text-primary); font-size: 0.85rem; margin-bottom: 0.35rem; display: block;">Number of Bathrooms</label>
                  <select id="edit-p-bathrooms" style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.92rem; box-sizing: border-box;">
                    <option value="1" ${Number(e.bathrooms)===1?"selected":""}>1 Bathroom</option>
                    <option value="2" ${Number(e.bathrooms||2)===2?"selected":""}>2 Bathrooms</option>
                    <option value="3" ${Number(e.bathrooms)===3?"selected":""}>3 Bathrooms</option>
                    <option value="4" ${Number(e.bathrooms)>=4?"selected":""}>4+ Bathrooms</option>
                  </select>
                </div>
              </div>

              <div class="modal-grid-2col">
                <div class="input-field-group">
                  <label style="font-weight: 700; color: var(--text-primary); font-size: 0.85rem; margin-bottom: 0.35rem; display: block;">Available From</label>
                  <input type="text" id="edit-p-available" value="${e.availableFrom?e.availableFrom.replace(/"/g,"&quot;"):"Immediate"}" placeholder="e.g. Immediate, 1st of Next Month" style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.92rem; box-sizing: border-box;" />
                </div>
                <div class="input-field-group">
                  <label style="font-weight: 700; color: var(--text-primary); font-size: 0.85rem; margin-bottom: 0.35rem; display: block;">Preferred Tenants</label>
                  <select id="edit-p-tenants" style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.92rem; box-sizing: border-box;">
                    <option value="Any" ${e.preferredTenants==="Any"?"selected":""}>Any (Family or Bachelors)</option>
                    <option value="Family Only" ${e.preferredTenants==="Family Only"?"selected":""}>Family Only</option>
                    <option value="Bachelors Only" ${e.preferredTenants==="Bachelors Only"?"selected":""}>Bachelors Only</option>
                    <option value="Company Lease" ${e.preferredTenants==="Company Lease"?"selected":""}>Company Lease</option>
                  </select>
                </div>
              </div>

              <!-- Amenities Checkboxes -->
              <div class="input-field-group">
                <label style="font-weight: 700; color: var(--text-primary); font-size: 0.85rem; margin-bottom: 0.6rem; display: block;">
                  <i class="fa-solid fa-list-check" style="color: var(--accent-emerald);"></i> Society & Unit Amenities
                </label>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 0.65rem;">
                  ${[{id:"Power Backup",icon:"fa-bolt",name:"Power Backup"},{id:"Lift",icon:"fa-arrows-up-down",name:"Lift"},{id:"Car Parking",icon:"fa-square-parking",name:"Car Parking"},{id:"24/7 Security",icon:"fa-shield-halved",name:"24/7 Security"},{id:"Gym",icon:"fa-dumbbell",name:"Gym / Fitness Center"},{id:"Swimming Pool",icon:"fa-person-swimming",name:"Swimming Pool"},{id:"Clubhouse",icon:"fa-champagne-glasses",name:"Clubhouse"},{id:"CCTV",icon:"fa-video",name:"CCTV Surveillance"},{id:"Gas Pipeline",icon:"fa-fire-burner",name:"Piped Gas"},{id:"Children Play Area",icon:"fa-children",name:"Children Play Area"}].map(E=>{const y=(e.amenities||[]).some(x=>x.toLowerCase().includes(E.id.toLowerCase()));return`
                      <label style="display: flex; align-items: center; gap: 0.6rem; padding: 0.6rem 0.85rem; border-radius: 10px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); cursor: pointer; font-size: 0.84rem; font-weight: 600;">
                        <input type="checkbox" name="edit-amenity" value="${E.name}" ${y?"checked":""} style="accent-color: var(--accent-emerald); width: 16px; height: 16px;" />
                        <i class="fa-solid ${E.icon}" style="color: var(--accent-emerald); width: 16px; text-align: center;"></i>
                        <span>${E.name}</span>
                      </label>
                    `}).join("")}
                </div>
              </div>

              <!-- Photos Management -->
              <div class="input-field-group">
                <label style="font-weight: 700; color: var(--text-primary); font-size: 0.85rem; margin-bottom: 0.45rem; display: block;">
                  <i class="fa-solid fa-images" style="color: var(--accent-emerald);"></i> Property Photos (<span id="edit-photos-count">${g.length}</span>)
                </label>
                
                <div id="edit-photos-preview" style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 0.85rem;"></div>

                <input type="file" id="edit-p-file" accept="image/*" multiple style="display: none;" />
                <label for="edit-p-file" id="edit-p-dropzone" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1.25rem; border: 2px dashed rgba(16, 185, 129, 0.4); border-radius: 14px; background: rgba(16, 185, 129, 0.05); cursor: pointer; text-align: center;">
                  <i class="fa-solid fa-cloud-arrow-up" style="font-size: 1.8rem; color: var(--accent-emerald); margin-bottom: 0.4rem;"></i>
                  <span style="font-size: 0.9rem; font-weight: 700; color: var(--text-primary);">Tap to Add More Photos from Camera / Gallery</span>
                  <span style="font-size: 0.78rem; color: var(--text-muted); margin-top: 2px;">Supports mobile phone photos & HD desktop pictures</span>
                </label>
                <div id="edit-p-upload-status" style="display: none; margin-top: 0.4rem; font-size: 0.82rem; color: var(--accent-emerald); font-weight: 600; text-align: center;"></div>
              </div>

              <!-- Description -->
              <div class="input-field-group">
                <label style="font-weight: 700; color: var(--text-primary); font-size: 0.85rem; margin-bottom: 0.35rem; display: block;">Property Description</label>
                <textarea id="edit-p-desc" rows="3" style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.92rem; box-sizing: border-box;">${e.description||""}</textarea>
              </div>

              <!-- Owner Name & Phone -->
              <div class="modal-grid-2col">
                <div class="input-field-group">
                  <label style="font-weight: 700; color: var(--text-primary); font-size: 0.85rem; margin-bottom: 0.35rem; display: block;">Owner / Contact Name</label>
                  <input type="text" id="edit-p-owner-name" value="${e.ownerName?e.ownerName.replace(/"/g,"&quot;"):"V. RAMANA"}" style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.92rem; box-sizing: border-box;" />
                </div>
                <div class="input-field-group">
                  <label style="font-weight: 700; color: var(--text-primary); font-size: 0.85rem; margin-bottom: 0.35rem; display: block;">Owner Contact Phone</label>
                  <input type="tel" id="edit-p-owner-phone" value="${e.ownerPhone?e.ownerPhone.replace(/"/g,"&quot;"):"+91 80504 07710"}" style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.92rem; box-sizing: border-box;" />
                </div>
              </div>

              <!-- Action Footer -->
              <div style="display: flex; gap: 0.85rem; justify-content: flex-end; margin-top: 1rem; border-top: 1px solid var(--border-color); padding-top: 1.25rem;">
                <button type="button" id="btn-cancel-edit-form" class="nav-btn" style="padding: 0.85rem 1.5rem; background: var(--bg-glass); border: 1px solid var(--border-color); color: var(--text-primary); font-weight: 700;">
                  Cancel
                </button>
                <button type="submit" id="btn-save-edit-form" class="nav-btn nav-btn-primary" style="padding: 0.85rem 1.75rem; font-weight: 800; display: inline-flex; align-items: center; gap: 0.5rem;">
                  <i class="fa-solid fa-floppy-disk"></i> Save Changes
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>
    `;const S=()=>{r.openModal("property-details",e)};(P=document.getElementById("btn-back-from-edit"))==null||P.addEventListener("click",S),(T=document.getElementById("btn-close-edit"))==null||T.addEventListener("click",S),(N=document.getElementById("btn-cancel-edit-form"))==null||N.addEventListener("click",S);const A=document.getElementById("edit-photos-preview"),B=document.getElementById("edit-photos-count");w();const k=document.getElementById("edit-p-file"),F=document.getElementById("edit-p-upload-status");k==null||k.addEventListener("change",E=>{const y=Array.from(E.target.files||[]);if(!y.length)return;F&&(F.style.display="block",F.innerHTML=`<i class="fa-solid fa-spinner fa-spin"></i> Reading ${y.length} photo(s)...`);let x=0;y.forEach(I=>{const z=new FileReader;z.onload=L=>{g.push(L.target.result),x++,x===y.length&&(F&&(F.innerHTML=`✅ Added ${y.length} new photo(s)!`,setTimeout(()=>{F&&(F.style.display="none")},2e3)),w())},z.readAsDataURL(I)})}),(_=document.getElementById("form-edit-property"))==null||_.addEventListener("submit",async E=>{E.preventDefault();const y=document.getElementById("btn-save-edit-form");y&&(y.disabled=!0,y.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Saving changes...');const x=document.getElementById("edit-p-bhk").value,I=x==="1 BHK"?"1bhk":x==="2 BHK"?"2bhk":x==="3 BHK"?"3bhk":"4bhk",z=Array.from(document.querySelectorAll('input[name="edit-amenity"]:checked')).map(h=>h.value),L={title:document.getElementById("edit-p-title").value.trim(),locality:document.getElementById("edit-p-locality").value.trim(),address:document.getElementById("edit-p-address").value.trim(),price:Number(document.getElementById("edit-p-price").value),deposit:Number(document.getElementById("edit-p-deposit").value),bhk:x,bhkType:I,sqft:Number(document.getElementById("edit-p-sqft").value),furnishing:document.getElementById("edit-p-furnishing").value,floor:document.getElementById("edit-p-floor").value.trim(),facing:document.getElementById("edit-p-facing").value,bathrooms:Number(document.getElementById("edit-p-bathrooms").value),availableFrom:document.getElementById("edit-p-available").value.trim()||"Immediate",preferredTenants:document.getElementById("edit-p-tenants").value,amenities:z,images:g.length>0?g:e.images,description:document.getElementById("edit-p-desc").value.trim(),ownerName:document.getElementById("edit-p-owner-name").value.trim(),ownerPhone:document.getElementById("edit-p-owner-phone").value.trim()};await r.updateProperty(e.id,L),$(`✨ Property "${L.title}" updated successfully!`),r.openModal("property-details",{...e,...L})})}(O=document.getElementById("btn-close-modal"))==null||O.addEventListener("click",()=>{r.closeModal()}),(j=document.getElementById("modal-backdrop"))==null||j.addEventListener("click",g=>{g.target.id==="modal-backdrop"&&r.closeModal()})}async function re(a,e=1600,i=1600,o=.82){return typeof a=="string"&&a.startsWith("data:")?{dataUrl:a,fileName:"property-photo.jpg",mimeType:"image/jpeg",originalSize:a.length,compressedSize:a.length}:new Promise((s,l)=>{const t=a.name||"property-photo.jpg";if(!(a.type&&a.type.startsWith("image/")||/\.(jpe?g|png|webp|heic|heif|bmp|gif)$/i.test(t)||!a.type)&&a.type)return l(new Error("Selected file is not an image"));const c=URL.createObjectURL(a),m=new Image;m.onload=()=>{try{URL.revokeObjectURL(c);let{width:p,height:n}=m;(p>e||n>i)&&(p/n>e/i?(n=Math.round(n*e/p),p=e):(p=Math.round(p*i/n),n=i)),p=Math.max(1,p),n=Math.max(1,n);const d=document.createElement("canvas");d.width=p,d.height=n;const f=d.getContext("2d");if(!f)throw new Error("Canvas 2D context unavailable");f.fillStyle="#ffffff",f.fillRect(0,0,p,n),f.drawImage(m,0,0,p,n);const b=d.toDataURL("image/jpeg",o);s({dataUrl:b,fileName:t.replace(/\.[^/.]+$/,"")+".jpg",mimeType:"image/jpeg",width:p,height:n,originalSize:a.size,compressedSize:Math.round(b.length*3/4)})}catch(p){console.warn("Canvas compression fallback due to:",p),G(a,t,s,l)}},m.onerror=()=>{URL.revokeObjectURL(c),G(a,t,s,l)},m.src=c})}function G(a,e,i,o){const s=new FileReader;s.onload=l=>{i({dataUrl:l.target.result,fileName:e.replace(/\.[^/.]+$/,"")+".jpg",mimeType:a.type||"image/jpeg",width:800,height:600,originalSize:a.size,compressedSize:a.size})},s.onerror=()=>o(new Error("Failed to read image file on this device")),s.readAsDataURL(a)}async function X(a,e=null){const i=Array.from(a),o=[];for(let s=0;s<i.length;s++){const l=i[s];e&&e(s+1,i.length);try{const t=await re(l);o.push(t)}catch(t){console.warn(`Could not compress file ${l.name||s}:`,t)}}return o}function se(){var c,m,p;if(r.activeModal!=="list-property")return;const a=document.getElementById("modal-root");if(!a)return;a.innerHTML=`
    <div class="modal-overlay" id="modal-backdrop">
      <div class="modal-card" style="max-width: 650px; max-height: 90vh; overflow-y: auto;">
        <button class="modal-close-btn" id="btn-close-modal">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <div class="modal-body">
          <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem;">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: var(--accent-indigo-light); color: var(--accent-indigo); display: flex; align-items: center; justify-content: center; font-size: 1.3rem;">
              <i class="fa-solid fa-house-medical"></i>
            </div>
            <div>
              <h3 class="font-heading" style="font-size: 1.5rem;">List Your Property in Bengaluru</h3>
              <p style="font-size: 0.85rem; color: var(--text-secondary);">Post your verified rental listing and reach thousands of prospective tenants across Bangalore.</p>
            </div>
          </div>

          <form id="form-list-property" style="display: flex; flex-direction: column; gap: 1.25rem;">
            <div class="input-field-group">
              <label>Property Name / Headline</label>
              <input type="text" id="lp-title" placeholder="e.g. Prestige Lakeview Spacious 2BHK" required />
            </div>

            <div class="modal-grid-2col">
              <div class="input-field-group">
                <label>Locality</label>
                <select id="lp-locality" class="search-select" style="padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input);">
                  ${Q.map(n=>`<option value="${n}">${n}</option>`).join("")}
                </select>
              </div>

              <div class="input-field-group">
                <label>BHK Type</label>
                <select id="lp-bhk" class="search-select" style="padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input);">
                  <option value="1bhk">1 BHK</option>
                  <option value="2bhk" selected>2 BHK Apartment</option>
                  <option value="3bhk">3 BHK</option>
                  <option value="4bhk">4+ BHK / Villa</option>
                </select>
              </div>
            </div>

            <div class="modal-grid-2col">
              <div class="input-field-group">
                <label>Monthly Rent Expected (₹)</label>
                <input type="number" id="lp-price" placeholder="45000" min="5000" step="1000" inputmode="numeric" required />
              </div>

              <div class="input-field-group">
                <label>Security Deposit (₹)</label>
                <input type="number" id="lp-deposit" placeholder="180000" min="10000" step="5000" inputmode="numeric" required />
              </div>
            </div>

            <div class="modal-grid-2col">
              <div class="input-field-group">
                <label>Built-up Area (Sq Ft)</label>
                <input type="number" id="lp-sqft" placeholder="1250" inputmode="numeric" required />
              </div>

              <div class="input-field-group">
                <label>Furnishing Status</label>
                <select id="lp-furnishing" class="search-select" style="padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input);">
                  <option value="Fully Furnished">Fully Furnished</option>
                  <option value="Semi-Furnished" selected>Semi-Furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                </select>
              </div>
            <div class="modal-grid-2col">
              <div class="input-field-group">
                <label>Floor Level</label>
                <input type="text" id="lp-floor" placeholder="e.g. 3rd of 8, Ground Floor, 2nd Floor" list="lp-floor-datalist" required />
                <datalist id="lp-floor-datalist">
                  <option value="Ground Floor"></option>
                  <option value="1st Floor"></option>
                  <option value="2nd Floor"></option>
                  <option value="3rd Floor"></option>
                  <option value="3rd of 8"></option>
                  <option value="4th Floor"></option>
                  <option value="5th Floor"></option>
                  <option value="Top Floor / Penthouse"></option>
                </datalist>
              </div>

              <div class="input-field-group">
                <label>Facing (Direction)</label>
                <select id="lp-facing" class="search-select" style="padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input);">
                  <option value="East Facing" selected>East Facing</option>
                  <option value="North Facing">North Facing</option>
                  <option value="North-East Facing">North-East Facing</option>
                  <option value="West Facing">West Facing</option>
                  <option value="South Facing">South Facing</option>
                  <option value="South-East Facing">South-East Facing</option>
                  <option value="North-West Facing">North-West Facing</option>
                  <option value="South-West Facing">South-West Facing</option>
                </select>
              </div>
            </div>

            <div class="input-field-group">
              <label style="font-weight: 700; margin-bottom: 0.5rem; display: block;">
                <i class="fa-solid fa-list-check" style="color: var(--accent-indigo);"></i> Society & Unit Amenities
              </label>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0.65rem; background: var(--bg-input); padding: 0.85rem; border-radius: 12px; border: 1px solid var(--border-color);">
                <label style="display: flex; align-items: center; gap: 0.55rem; cursor: pointer; font-size: 0.9rem; font-weight: 600; color: var(--text-primary); user-select: none;">
                  <input type="checkbox" name="lp-amenity" value="Power Backup" checked style="width: 18px; height: 18px; accent-color: var(--accent-indigo); cursor: pointer;" />
                  <span><i class="fa-solid fa-bolt" style="color: #f59e0b; width: 16px;"></i> Power Backup</span>
                </label>
                <label style="display: flex; align-items: center; gap: 0.55rem; cursor: pointer; font-size: 0.9rem; font-weight: 600; color: var(--text-primary); user-select: none;">
                  <input type="checkbox" name="lp-amenity" value="Lift" checked style="width: 18px; height: 18px; accent-color: var(--accent-indigo); cursor: pointer;" />
                  <span><i class="fa-solid fa-elevator" style="color: var(--accent-indigo); width: 16px;"></i> Lift</span>
                </label>
                <label style="display: flex; align-items: center; gap: 0.55rem; cursor: pointer; font-size: 0.9rem; font-weight: 600; color: var(--text-primary); user-select: none;">
                  <input type="checkbox" name="lp-amenity" value="Car Parking" checked style="width: 18px; height: 18px; accent-color: var(--accent-indigo); cursor: pointer;" />
                  <span><i class="fa-solid fa-square-parking" style="color: #3b82f6; width: 16px;"></i> Car Parking</span>
                </label>
                <label style="display: flex; align-items: center; gap: 0.55rem; cursor: pointer; font-size: 0.9rem; font-weight: 600; color: var(--text-primary); user-select: none;">
                  <input type="checkbox" name="lp-amenity" value="24/7 Security" checked style="width: 18px; height: 18px; accent-color: var(--accent-indigo); cursor: pointer;" />
                  <span><i class="fa-solid fa-shield-halved" style="color: var(--accent-emerald); width: 16px;"></i> 24/7 Security</span>
                </label>
              </div>
            </div>

            <div class="input-field-group">
              <label style="font-weight: 700; display: block; margin-bottom: 0.35rem;">
                Upload Property Photos <span style="font-weight: 400; font-size: 0.8rem; color: var(--accent-indigo);">(Mobile Camera & Laptop HD)</span>
              </label>
              <input 
                type="file" 
                id="lp-file-input" 
                accept="image/*" 
                multiple 
                style="position: absolute; width: 0.1px; height: 0.1px; opacity: 0; overflow: hidden; z-index: -1;" 
              />
              <label for="lp-file-input" id="lp-upload-dropzone" class="admin-dropzone-box" style="display: block; cursor: pointer; padding: 1.25rem; text-align: center; border: 2px dashed var(--border-color); border-radius: 12px; background: rgba(99, 102, 241, 0.04); -webkit-tap-highlight-color: transparent;">
                <div style="font-size: 1.8rem; color: var(--accent-indigo); margin-bottom: 0.3rem;">
                  <i class="fa-solid fa-cloud-arrow-up"></i>
                </div>
                <div style="font-weight: 700; font-size: 0.9rem; color: var(--text-primary);">Tap to Select from Mobile Camera / Gallery or Drag & Drop</div>
                <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.2rem;">⚡ Auto-compresses mobile camera photos for instant upload</div>
              </label>
              <div id="lp-upload-status" style="display: none; margin-top: 0.5rem; font-size: 0.85rem; color: var(--accent-indigo); font-weight: 600; text-align: center;"></div>
              <div id="lp-image-preview" style="display: flex; gap: 0.6rem; flex-wrap: wrap; margin-top: 0.6rem;"></div>
            </div>

            <div class="modal-grid-2col">
              <div class="input-field-group">
                <label>Your Full Name</label>
                <input type="text" id="lp-owner-name" placeholder="Owner Name" required />
              </div>

              <div class="input-field-group">
                <label>Contact Phone Number</label>
                <input type="tel" id="lp-owner-phone" placeholder="+91 98450 99887" inputmode="tel" required />
              </div>
            </div>

            <button type="submit" id="btn-submit-listing" class="nav-btn nav-btn-primary" style="width: 100%; justify-content: center; padding: 0.9rem; font-size: 1rem; margin-top: 0.5rem;">
              <i class="fa-solid fa-paper-plane"></i> Publish 0% Brokerage Listing
            </button>
          </form>
        </div>
      </div>
    </div>
  `;const e=document.getElementById("lp-file-input"),i=document.getElementById("lp-upload-dropzone"),o=document.getElementById("lp-image-preview"),s=document.getElementById("lp-upload-status");let l=[];i==null||i.addEventListener("dragover",n=>{n.preventDefault(),i.style.borderColor="var(--accent-indigo)"}),i==null||i.addEventListener("dragleave",()=>{i.style.borderColor="var(--border-color)"}),i==null||i.addEventListener("drop",n=>{var d;n.preventDefault(),i.style.borderColor="var(--border-color)",(d=n.dataTransfer.files)!=null&&d.length&&t(Array.from(n.dataTransfer.files))}),e==null||e.addEventListener("change",n=>{var d;(d=n.target.files)!=null&&d.length&&t(Array.from(n.target.files))});async function t(n){if(!(!n||n.length===0)){s&&(s.style.display="block",s.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Optimizing mobile photos for fast upload...');try{const d=await X(n,(f,b)=>{s&&(s.innerHTML=`<i class="fa-solid fa-spinner fa-spin"></i> Optimizing photo ${f} of ${b}...`)});d.forEach(f=>{l.push(f)}),s&&(s.innerHTML=`✅ ${d.length} photo(s) optimized & ready!`,setTimeout(()=>{s&&(s.style.display="none")},2500))}catch(d){console.error("Error processing mobile images:",d),$("⚠️ Could not process image, please try another file."),s&&(s.style.display="none")}u()}}function u(){if(o){if(l.length===0){o.innerHTML="";return}o.innerHTML=l.map((n,d)=>{const f=typeof n=="string"?n:n.dataUrl,b=n.compressedSize?`${Math.round(n.compressedSize/1024)} KB`:"";return`
        <div style="position: relative; display: inline-block; margin: 4px;">
          <img src="${f}" style="width: 76px; height: 76px; border-radius: 10px; object-fit: cover; border: 2px solid var(--accent-indigo); display: block;" />
          ${b?`<span style="position: absolute; bottom: 3px; left: 3px; background: rgba(0,0,0,0.75); color: #fff; font-size: 0.65rem; padding: 1px 4px; border-radius: 4px; font-weight: 700;">${b}</span>`:""}
          <button type="button" class="btn-remove-lp-img" data-img-idx="${d}" style="position: absolute; top: -8px; right: -8px; width: 28px; height: 28px; border-radius: 50%; background: #ef4444; color: #fff; border: 2px solid #fff; font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.4); z-index: 10; touch-action: manipulation;" title="Remove">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      `}).join(""),o.querySelectorAll(".btn-remove-lp-img").forEach(n=>{n.addEventListener("click",d=>{d.preventDefault(),d.stopPropagation();const f=Number(n.dataset.imgIdx);l.splice(f,1),u()})})}}(c=document.getElementById("form-list-property"))==null||c.addEventListener("submit",async n=>{var F,E;n.preventDefault();const d=document.getElementById("btn-submit-listing");d&&(d.disabled=!0,d.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Saving listing...');const f=document.getElementById("lp-title").value,b=document.getElementById("lp-locality").value,v=document.getElementById("lp-bhk").value,P=v==="1bhk"?"1 BHK":v==="2bhk"?"2 BHK":v==="3bhk"?"3 BHK":"4+ BHK",T=Number(document.getElementById("lp-price").value),N=Number(document.getElementById("lp-deposit").value),_=Number(document.getElementById("lp-sqft").value),O=document.getElementById("lp-furnishing").value,j=document.getElementById("lp-owner-name").value,g=document.getElementById("lp-owner-phone").value,S=((F=document.getElementById("lp-floor"))==null?void 0:F.value.trim())||"3rd Floor",A=((E=document.getElementById("lp-facing"))==null?void 0:E.value)||"East Facing",B=Array.from(document.querySelectorAll('input[name="lp-amenity"]:checked')).map(y=>y.value),w=`prop-custom-${Date.now()}`;let k=[];if(l.length>0)for(let y=0;y<l.length;y++){const x=l[y],I=typeof x=="string"?x:x.dataUrl,z=typeof x=="object"&&x.fileName?x.fileName:`listing-${y+1}.jpg`,L=typeof x=="object"&&x.mimeType?x.mimeType:"image/jpeg";d&&(d.innerHTML=`<i class="fa-solid fa-spinner fa-spin"></i> Uploading photo ${y+1} of ${l.length}...`);try{const h=await C.uploadImage(I,w,z,L);h&&h.url?k.push(h.url):k.push(I)}catch(h){console.warn("Image upload fallback:",h),k.push(I)}}else k=["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"];d&&(d.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Finalizing listing...'),await r.addProperty({id:w,title:f,locality:b,address:`${b}, Bengaluru`,price:T,deposit:N,bhk:P,bhkType:v,type:"Apartment",furnishing:O,sqft:_,bathrooms:2,floor:S,facing:A,availableFrom:"Immediate",preferredTenants:"Any",images:k,amenities:B.length>0?B:["Power Backup","Lift","Car Parking","24/7 Security"],description:`Newly listed ${P} apartment in prime ${b}. Directly posted by property owner.`,ownerName:j,ownerPhone:g,ownerType:"Direct Owner"}),r.closeModal(),$(`✨ Property "${f}" in ${b} listed successfully!`)}),(m=document.getElementById("btn-close-modal"))==null||m.addEventListener("click",()=>{r.closeModal()}),(p=document.getElementById("modal-backdrop"))==null||p.addEventListener("click",n=>{n.target.id==="modal-backdrop"&&r.closeModal()})}function V(a){return typeof a!="string"?a:a.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function le(){var o,s,l,t,u,c;if(r.activeModal!=="auth-signin")return;const a=document.getElementById("modal-root");if(!a)return;const e=r.userAuthMode==="signin";a.innerHTML=`
    <div class="modal-overlay" id="modal-backdrop">
      <div class="modal-card" style="max-width: 460px; width: 100%; box-sizing: border-box; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 24px; padding: 1.75rem 1.5rem; box-shadow: var(--shadow-lg); position: relative; max-height: 90vh; overflow-y: auto;">
        <button class="modal-close-btn" id="btn-close-modal" style="position: absolute; top: 18px; right: 18px; background: var(--bg-input); border: 1px solid var(--border-color); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text-secondary); transition: all 0.2s ease;">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <div style="text-align: center; margin-bottom: 1.5rem;">
          <div style="width: 64px; height: 64px; border-radius: 20px; background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(59, 130, 246, 0.15)); border: 1px solid var(--accent-emerald); display: flex; align-items: center; justify-content: center; font-size: 1.8rem; color: var(--accent-emerald); margin: 0 auto 1rem auto; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);">
            <i class="${e?"fa-solid fa-user-lock":"fa-solid fa-user-plus"}"></i>
          </div>
          <h2 class="font-heading" style="font-size: 1.6rem; margin-bottom: 0.35rem; color: var(--text-primary); font-weight: 800;">
            ${e?"Sign In to Bengaluru Properties":"Create New Account"}
          </h2>
          <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.4;">
            ${e?"Enter your email and password to access your account and saved properties.":"Register with your email to save properties and request instant site visits."}
          </p>
        </div>

        <!-- Mode Toggle: Sign In vs Create Account -->
        <div style="display: flex; background: var(--bg-input); padding: 4px; border-radius: 14px; border: 1px solid var(--border-color); margin-bottom: 1.5rem;">
          <button id="btn-switch-signin" style="flex: 1; padding: 0.65rem; border-radius: 10px; border: none; font-size: 0.88rem; font-weight: 700; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 0.5rem; ${e?"background: var(--accent-emerald); color: #ffffff; box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);":"background: transparent; color: var(--text-muted);"}">
            <i class="fa-solid fa-right-to-bracket"></i> Sign In
          </button>
          <button id="btn-switch-register" style="flex: 1; padding: 0.65rem; border-radius: 10px; border: none; font-size: 0.88rem; font-weight: 700; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 0.5rem; ${e?"background: transparent; color: var(--text-muted);":"background: var(--accent-emerald); color: #ffffff; box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);"}">
            <i class="fa-solid fa-user-plus"></i> Create Account
          </button>
        </div>

        ${e?`
          <!-- Sign In Form -->
          <form id="form-user-login" style="display: flex; flex-direction: column; gap: 1.1rem;">
            <div class="input-field-group" style="text-align: left;">
              <label style="font-weight: 700; font-size: 0.85rem; color: var(--text-primary); margin-bottom: 0.4rem; display: block;">
                Email Address
              </label>
              <div style="position: relative;">
                <i class="fa-solid fa-envelope" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted);"></i>
                <input 
                  type="email" 
                  id="user-login-email" 
                  placeholder="name@example.com" 
                  required 
                  autocomplete="email"
                  style="width: 100%; padding: 0.85rem 0.85rem 0.85rem 2.6rem; border-radius: 12px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.95rem; font-weight: 500;"
                />
              </div>
            </div>

            <div class="input-field-group" style="text-align: left;">
              <label style="font-weight: 700; font-size: 0.85rem; color: var(--text-primary); margin-bottom: 0.4rem; display: block;">
                Password
              </label>
              <div style="position: relative;">
                <i class="fa-solid fa-lock" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted); z-index: 1;"></i>
                <input 
                  type="password" 
                  id="user-login-pass" 
                  placeholder="••••••••" 
                  required 
                  autocomplete="new-password"
                  style="width: 100%; padding: 0.85rem 3.2rem 0.85rem 2.6rem; border-radius: 12px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.95rem; font-weight: 500; box-sizing: border-box;"
                />
                <button 
                  type="button" 
                  id="btn-toggle-login-pass" 
                  style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: transparent; border: none; color: var(--text-muted); cursor: pointer; font-size: 1.15rem; width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; z-index: 10; transition: all 0.2s ease;" 
                  title="Click to show or hide password"
                >
                  <i class="fa-solid fa-eye" id="icon-login-pass-eye"></i>
                </button>
              </div>
            </div>

            <button type="submit" class="nav-btn nav-btn-primary" style="width: 100%; justify-content: center; padding: 0.95rem; font-size: 1rem; margin-top: 0.35rem; border-radius: 12px; font-weight: 700; gap: 0.6rem; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);">
              <i class="fa-solid fa-right-to-bracket"></i> Secure Sign In
            </button>
          </form>
        `:`
          <!-- Register / Create Account Form -->
          <form id="form-user-register" style="display: flex; flex-direction: column; gap: 1.1rem;">
            <div class="input-field-group" style="text-align: left;">
              <label style="font-weight: 700; font-size: 0.85rem; color: var(--text-primary); margin-bottom: 0.4rem; display: block;">
                Full Name
              </label>
              <div style="position: relative;">
                <i class="fa-solid fa-user" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted);"></i>
                <input 
                  type="text" 
                  id="user-reg-name" 
                  placeholder="Enter your full name" 
                  required 
                  style="width: 100%; padding: 0.85rem 0.85rem 0.85rem 2.6rem; border-radius: 12px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.95rem; font-weight: 500;"
                />
              </div>
            </div>

            <div class="input-field-group" style="text-align: left;">
              <label style="font-weight: 700; font-size: 0.85rem; color: var(--text-primary); margin-bottom: 0.4rem; display: block;">
                Email Address
              </label>
              <div style="position: relative;">
                <i class="fa-solid fa-envelope" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted);"></i>
                <input 
                  type="email" 
                  id="user-reg-email" 
                  placeholder="name@example.com" 
                  required 
                  autocomplete="email"
                  style="width: 100%; padding: 0.85rem 0.85rem 0.85rem 2.6rem; border-radius: 12px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.95rem; font-weight: 500;"
                />
              </div>
            </div>

            <div class="input-field-group" style="text-align: left;">
              <label style="font-weight: 700; font-size: 0.85rem; color: var(--text-primary); margin-bottom: 0.4rem; display: block;">
                Create Password
              </label>
              <div style="position: relative;">
                <i class="fa-solid fa-lock" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted); z-index: 1;"></i>
                <input 
                  type="password" 
                  id="user-reg-pass" 
                  placeholder="Minimum 6 characters" 
                  required 
                  minlength="6"
                  autocomplete="new-password"
                  style="width: 100%; padding: 0.85rem 3.2rem 0.85rem 2.6rem; border-radius: 12px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.95rem; font-weight: 500; box-sizing: border-box;"
                />
                <button 
                  type="button" 
                  id="btn-toggle-reg-pass" 
                  style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: transparent; border: none; color: var(--text-muted); cursor: pointer; font-size: 1.15rem; width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; z-index: 10; transition: all 0.2s ease;" 
                  title="Click to show or hide password"
                >
                  <i class="fa-solid fa-eye" id="icon-reg-pass-eye"></i>
                </button>
              </div>
            </div>

            <div class="input-field-group" style="text-align: left;">
              <label style="font-weight: 700; font-size: 0.85rem; color: var(--text-primary); margin-bottom: 0.4rem; display: block;">
                Confirm Password
              </label>
              <div style="position: relative;">
                <i class="fa-solid fa-lock-keyhole" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted); z-index: 1;"></i>
                <input 
                  type="password" 
                  id="user-reg-confirm" 
                  placeholder="Re-enter password" 
                  required 
                  minlength="6"
                  autocomplete="new-password"
                  style="width: 100%; padding: 0.85rem 3.2rem 0.85rem 2.6rem; border-radius: 12px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.95rem; font-weight: 500; box-sizing: border-box;"
                />
                <button 
                  type="button" 
                  id="btn-toggle-confirm-pass" 
                  style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: transparent; border: none; color: var(--text-muted); cursor: pointer; font-size: 1.15rem; width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; z-index: 10; transition: all 0.2s ease;" 
                  title="Click to show or hide password"
                >
                  <i class="fa-solid fa-eye" id="icon-confirm-pass-eye"></i>
                </button>
              </div>
            </div>

            <button type="submit" class="nav-btn nav-btn-primary" style="width: 100%; justify-content: center; padding: 0.95rem; font-size: 1rem; margin-top: 0.35rem; border-radius: 12px; font-weight: 700; gap: 0.6rem; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);">
              <i class="fa-solid fa-user-plus"></i> Register & Sign In
            </button>
          </form>
        `}

        <!-- Security Badge Notice -->
        <div style="margin-top: 1.5rem; text-align: center; font-size: 0.75rem; color: var(--text-muted); display: flex; align-items: center; justify-content: center; gap: 0.4rem;">
          <i class="fa-solid fa-shield-halved" style="color: var(--accent-emerald);"></i> 256-Bit SSL Encrypted & Secure Authentication
        </div>
      </div>
    </div>
  `,(o=document.getElementById("btn-switch-signin"))==null||o.addEventListener("click",()=>{r.userAuthMode="signin",r.notify()}),(s=document.getElementById("btn-switch-register"))==null||s.addEventListener("click",()=>{r.userAuthMode="register",r.notify()}),(l=document.getElementById("form-user-login"))==null||l.addEventListener("submit",async m=>{var P,T;m.preventDefault();const p=((P=document.getElementById("user-login-email"))==null?void 0:P.value)||"",n=((T=document.getElementById("user-login-pass"))==null?void 0:T.value)||"",d=V(p.trim()),f=n.trim(),b=m.target.querySelector('button[type="submit"]');b&&(b.disabled=!0,b.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Authenticating...');const v=await r.loginUser(d,f);v.success?v.isAdmin?$("⚡ Logged in as Proprietor Admin!"):$(`🎉 Welcome back, ${v.user.name}!`):(b&&(b.disabled=!1,b.innerHTML='<i class="fa-solid fa-right-to-bracket"></i> Secure Sign In'),$(`❌ ${v.message}`))}),(t=document.getElementById("form-user-register"))==null||t.addEventListener("submit",async m=>{var O,j,g,S;m.preventDefault();const p=((O=document.getElementById("user-reg-name"))==null?void 0:O.value)||"",n=((j=document.getElementById("user-reg-email"))==null?void 0:j.value)||"",d=((g=document.getElementById("user-reg-pass"))==null?void 0:g.value)||"",f=((S=document.getElementById("user-reg-confirm"))==null?void 0:S.value)||"",b=V(p.trim()),v=V(n.trim()),P=d.trim(),T=f.trim();if(P!==T){$("⚠️ Passwords do not match! Please check again.");return}const N=m.target.querySelector('button[type="submit"]');N&&(N.disabled=!0,N.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Creating Account in DB...');const _=await r.registerUser({name:b,email:v,password:P});_.success?$(`🎉 Account created! Welcome, ${_.user.name}.`):(N&&(N.disabled=!1,N.innerHTML='<i class="fa-solid fa-user-plus"></i> Create My Account'),$(`❌ ${_.message}`))});const i=(m,p,n)=>{const d=document.getElementById(m),f=document.getElementById(p),b=document.getElementById(n);!d||!f||d.addEventListener("click",v=>{v.preventDefault(),v.stopPropagation();const P=f.type==="password";f.type=P?"text":"password",b&&(P?(b.className="fa-solid fa-eye-slash",d.style.color="var(--accent-emerald)",d.setAttribute("title","Hide password")):(b.className="fa-solid fa-eye",d.style.color="var(--text-muted)",d.setAttribute("title","Show password"))),f.focus()})};i("btn-toggle-login-pass","user-login-pass","icon-login-pass-eye"),i("btn-toggle-reg-pass","user-reg-pass","icon-reg-pass-eye"),i("btn-toggle-confirm-pass","user-reg-confirm","icon-confirm-pass-eye"),(u=document.getElementById("btn-close-modal"))==null||u.addEventListener("click",()=>{r.closeModal()}),(c=document.getElementById("modal-backdrop"))==null||c.addEventListener("click",m=>{m.target.id==="modal-backdrop"&&r.closeModal()})}function ne(){if(r.activeModal!=="admin-portal")return;const a=document.getElementById("modal-root");if(!a)return;(typeof r.isAdmin=="function"?r.isAdmin():!1)?ce(a):de(a)}function de(a){var u,c,m,p;a.innerHTML=`
    <div class="modal-overlay" id="admin-modal-backdrop">
      <div class="modal-card admin-login-card" style="max-width: 440px; background: var(--bg-surface); border: 2px solid rgba(239, 68, 68, 0.4); box-shadow: 0 20px 50px rgba(0,0,0,0.7); border-radius: 20px;">
        <button class="modal-close-btn" id="btn-close-admin-modal">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <div class="modal-body" style="padding: 2.25rem 1.75rem;">
          <div style="width: 64px; height: 64px; border-radius: 20px; background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.4); color: #ef4444; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin: 0 auto 1.25rem auto; box-shadow: 0 4px 14px rgba(239, 68, 68, 0.25);">
            <i class="fa-solid fa-lock"></i>
          </div>

          <div style="text-align: center; margin-bottom: 1.5rem;">
            <div style="display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.72rem; font-weight: 800; text-transform: uppercase; color: #ef4444; background: rgba(239, 68, 68, 0.1); padding: 0.25rem 0.65rem; border-radius: 20px; border: 1px solid rgba(239, 68, 68, 0.25); margin-bottom: 0.5rem;">
              <i class="fa-solid fa-shield-halved"></i> Protected Path: /admin
            </div>
            <h3 class="font-heading" style="font-size: 1.5rem; margin-bottom: 0.35rem; font-weight: 800;">Administrator Access</h3>
            <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.4;">
              This area is strictly restricted to Proprietor V. RAMANA. Please enter your administrator credentials stored in your secure environment.
            </p>
          </div>

          <div id="admin-auth-error-box" style="display: none; background: rgba(239, 68, 68, 0.12); border: 1px solid #ef4444; border-radius: 10px; padding: 0.75rem; margin-bottom: 1rem; color: #ef4444; font-size: 0.85rem; text-align: center;">
            <i class="fa-solid fa-triangle-exclamation"></i> <span id="admin-auth-error-msg">Invalid email or password!</span>
          </div>

          <form id="admin-login-form" style="display: flex; flex-direction: column; gap: 1.1rem;">
            <div class="input-field-group" style="text-align: left;">
              <label style="font-weight: 700; font-size: 0.85rem; color: var(--text-primary); margin-bottom: 0.35rem; display: block;">
                Admin Email
              </label>
              <div style="position: relative;">
                <i class="fa-solid fa-envelope" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted);"></i>
                <input 
                  type="email" 
                  id="admin-email-input" 
                  placeholder="admin@example.com" 
                  required 
                  autocomplete="username"
                  style="width: 100%; padding: 0.85rem 0.85rem 0.85rem 2.5rem; border-radius: 12px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.95rem; font-weight: 500;"
                />
              </div>
            </div>

            <div class="input-field-group" style="text-align: left;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                <label style="font-weight: 700; font-size: 0.85rem; color: var(--text-primary); margin: 0; display: block;">
                  Admin Password
                </label>
                <button type="button" id="btn-toggle-admin-pass-top" style="background: none; border: none; color: var(--accent-emerald); font-size: 0.8rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 0.35rem; padding: 0;">
                  <i class="fa-solid fa-eye" id="icon-admin-pass-eye-top"></i> <span id="text-admin-pass-top">Show Password</span>
                </button>
              </div>
              <div style="position: relative;">
                <i class="fa-solid fa-key" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted); z-index: 1;"></i>
                <input 
                  type="password" 
                  id="admin-pass-input" 
                  placeholder="Enter administrator password (ramana@123)" 
                  required 
                  autocomplete="new-password"
                  style="width: 100%; padding: 0.85rem 6.5rem 0.85rem 2.5rem; border-radius: 12px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); font-size: 0.95rem; font-weight: 500; box-sizing: border-box;"
                />
                <button 
                  type="button" 
                  id="btn-toggle-admin-pass" 
                  style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; color: #10b981; border-radius: 8px; padding: 0.35rem 0.65rem; font-size: 0.8rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 0.35rem; z-index: 10; transition: all 0.2s ease;" 
                  title="Toggle show/hide password"
                >
                  <i class="fa-solid fa-eye" id="icon-admin-pass-eye"></i> <span id="text-admin-pass-toggle">Show</span>
                </button>
              </div>
              <label style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.55rem; font-size: 0.82rem; color: var(--text-secondary); cursor: pointer; user-select: none;">
                <input type="checkbox" id="check-show-admin-pass" style="accent-color: var(--accent-emerald); width: 17px; height: 17px; cursor: pointer; border-radius: 4px;" />
                <span style="font-weight: 600;">Show password characters while typing</span>
              </label>
            </div>

            <button type="submit" id="btn-submit-admin-login" class="nav-btn nav-btn-primary" style="width: 100%; justify-content: center; padding: 0.95rem; font-size: 1rem; margin-top: 0.25rem; font-weight: 700; border-radius: 12px; gap: 0.5rem; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);">
              <i class="fa-solid fa-lock-open"></i> Authenticate & Unlock Portal
            </button>
          </form>

          <div style="text-align: center; margin-top: 1.25rem;">
            <a href="/" id="btn-return-home" style="font-size: 0.82rem; color: var(--text-secondary); text-decoration: none; display: inline-flex; align-items: center; gap: 0.35rem;">
              <i class="fa-solid fa-arrow-left"></i> Return to Homepage
            </a>
          </div>
        </div>
      </div>
    </div>
  `;const e=document.getElementById("admin-pass-input"),i=document.getElementById("btn-toggle-admin-pass"),o=document.getElementById("btn-toggle-admin-pass-top"),s=document.getElementById("check-show-admin-pass");function l(n){if(!e)return;e.type=n?"text":"password",s&&(s.checked=n);const d=document.getElementById("icon-admin-pass-eye"),f=document.getElementById("text-admin-pass-toggle");d&&(d.className=n?"fa-solid fa-eye-slash":"fa-solid fa-eye"),f&&(f.textContent=n?"Hide":"Show");const b=document.getElementById("icon-admin-pass-eye-top"),v=document.getElementById("text-admin-pass-top");b&&(b.className=n?"fa-solid fa-eye-slash":"fa-solid fa-eye"),v&&(v.textContent=n?"Hide Password":"Show Password"),e.focus()}i==null||i.addEventListener("click",n=>{n.preventDefault();const d=(e==null?void 0:e.type)==="password";l(d)}),o==null||o.addEventListener("click",n=>{n.preventDefault();const d=(e==null?void 0:e.type)==="password";l(d)}),s==null||s.addEventListener("change",n=>{l(n.target.checked)}),(u=document.getElementById("admin-login-form"))==null||u.addEventListener("submit",async n=>{n.preventDefault();const d=document.getElementById("admin-email-input").value.trim(),f=document.getElementById("admin-pass-input").value.trim(),b=document.getElementById("btn-submit-admin-login"),v=document.getElementById("admin-auth-error-box"),P=document.getElementById("admin-auth-error-msg");v&&(v.style.display="none");const T=f.trim();if(/^ramana[\s_-]*rentals$/i.test(T)||T.toLowerCase().includes("ramana rentals")||T.toLowerCase().replace(/\s+/g,"")==="ramanarentals"){v&&P&&(P.innerHTML='<i class="fa-solid fa-triangle-exclamation"></i> <strong>Access Denied:</strong> "ramana rentals" has been permanently removed. Please use the new admin password: <strong>ramana@123</strong>',v.style.display="block");const O=document.getElementById("admin-pass-input");O&&(O.value=""),$('❌ Access Denied: "ramana rentals" is completely removed! Use ramana@123');return}b&&(b.disabled=!0,b.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Verifying credentials...'),await r.adminLogin(d,f)?(r.pendingAdminTab&&(r.setAdminTab(r.pendingAdminTab),r.pendingAdminTab=null),$("⚡ Administrator Access Granted! Welcome V. RAMANA.")):(b&&(b.disabled=!1,b.innerHTML='<i class="fa-solid fa-lock-open"></i> Authenticate & Unlock Portal'),v&&P&&(P.innerText="Access Denied: Invalid administrator credentials.",v.style.display="block"),$("❌ Access Denied: Invalid credentials!"))});const t=()=>{r.closeModal(),(window.location.pathname.toLowerCase().replace(/\/$/,"")==="/admin"||window.location.hash.toLowerCase()==="#admin"||window.location.hash.toLowerCase()==="#/admin")&&history.replaceState(null,"","/")};(c=document.getElementById("btn-close-admin-modal"))==null||c.addEventListener("click",t),(m=document.getElementById("btn-return-home"))==null||m.addEventListener("click",n=>{n.preventDefault(),t()}),(p=document.getElementById("admin-modal-backdrop"))==null||p.addEventListener("click",n=>{n.target.id==="admin-modal-backdrop"&&t()})}function ce(a){var m,p;const e=r.allProperties,i=r.leads,o=r.contactInfo,s=e.reduce((n,d)=>n+(d.price||0),0),l=e.filter(n=>n.isVerified).length,t=r.adminTab||"dashboard";a.innerHTML=`
    <div class="admin-portal-fullscreen" id="admin-portal-shell">
      
      <!-- Fullscreen Admin Header Navbar -->
      <div class="admin-header-bar">
        <div class="admin-header-left">
          <div class="admin-brand-icon">
            <i class="fa-solid fa-user-shield"></i>
          </div>
          <div style="min-width: 0; flex: 1;">
            <div class="admin-title-row">
              <h3 class="font-heading admin-portal-heading">The Bangalore Properties</h3>
              <span class="admin-status-badge">PROPRIETOR ONLINE</span>
            </div>
            <p class="admin-subtitle-info">
              Logged in as <strong>${o.proprietor} (${o.role})</strong> | Phone: ${o.phone}
            </p>
          </div>
        </div>

        <div class="admin-header-right">
          <button id="btn-admin-logout" class="nav-btn btn-logout-action" title="Logout of Admin Portal">
            <i class="fa-solid fa-right-from-bracket"></i> <span class="hide-mobile">Logout</span>
          </button>
          <button class="modal-close-btn admin-close-btn" id="btn-close-admin-portal" title="Close Admin Portal">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>

      <!-- Admin Horizontal Tab Bar -->
      <div class="admin-tab-nav-bar">
        <button class="admin-tab-btn ${t==="dashboard"?"active":""}" data-admin-tab="dashboard">
          <i class="fa-solid fa-chart-pie"></i> <span>Dashboard & KPIs</span>
        </button>
        <button class="admin-tab-btn ${t==="properties"?"active":""}" data-admin-tab="properties">
          <i class="fa-solid fa-building"></i> <span>Manage Properties (${e.length})</span>
        </button>
        <button class="admin-tab-btn ${t==="add-property"?"active":""}" data-admin-tab="add-property">
          <i class="fa-solid fa-plus-circle"></i> <span>Add Property</span>
        </button>
        <button class="admin-tab-btn ${t==="leads"?"active":""}" data-admin-tab="leads">
          <i class="fa-solid fa-headset"></i> <span>Tenant Leads (${i.length})</span>
        </button>
        <button class="admin-tab-btn ${t==="settings"?"active":""}" data-admin-tab="settings">
          <i class="fa-solid fa-sliders"></i> <span>Settings</span>
        </button>
      </div>

      <!-- Admin Portal Body View -->
      <div class="admin-body-container">
        ${pe(t,e,i,o,s,l)}
      </div>

    </div>
  `,window.scrollTo(0,0),document.documentElement.scrollTop=0,document.body.scrollTop=0;const u=a.querySelector("#admin-portal-shell");u&&u.addEventListener("scroll",()=>{u.scrollTop!==0&&(u.scrollTop=0),u.scrollLeft!==0&&(u.scrollLeft=0)}),a.querySelectorAll("[data-admin-tab]").forEach(n=>{n.addEventListener("click",()=>{r.setAdminTab(n.dataset.adminTab);const d=a.querySelector(".admin-body-container");d&&(d.scrollTop=0)})});const c=(n=!1)=>{n?(r.adminLogout(),$("Logged out of Admin Portal.")):r.closeModal(),(window.location.pathname.toLowerCase().replace(/\/$/,"")==="/admin"||window.location.hash.toLowerCase()==="#admin")&&history.replaceState(null,"","/")};(m=document.getElementById("btn-admin-logout"))==null||m.addEventListener("click",()=>c(!0)),(p=document.getElementById("btn-close-admin-portal"))==null||p.addEventListener("click",()=>c(!1)),me(t,a)}function pe(a,e,i,o,s,l){return a==="dashboard"?`
      <!-- KPI Stats Grid -->
      <div class="admin-kpi-grid">
        <div class="kpi-card kpi-emerald">
          <div class="kpi-header-row">
            <span class="kpi-title">Total Active Properties</span>
            <i class="fa-solid fa-building kpi-icon"></i>
          </div>
          <div class="kpi-value">${e.length}</div>
          <div class="kpi-sub">Verified Bengaluru Properties</div>
        </div>

        <div class="kpi-card kpi-blue">
          <div class="kpi-header-row">
            <span class="kpi-title">100% Verified</span>
            <i class="fa-solid fa-shield-halved kpi-icon"></i>
          </div>
          <div class="kpi-value">${l}</div>
          <div class="kpi-sub">Physically Verified</div>
        </div>

        <div class="kpi-card kpi-pink">
          <div class="kpi-header-row">
            <span class="kpi-title">Tenant Leads</span>
            <i class="fa-solid fa-comments kpi-icon"></i>
          </div>
          <div class="kpi-value">${i.length}</div>
          <div class="kpi-sub">Active Inquiries & Visits</div>
        </div>

        <div class="kpi-card kpi-purple">
          <div class="kpi-header-row">
            <span class="kpi-title">Monthly Portfolio</span>
            <i class="fa-solid fa-indian-rupee-sign kpi-icon"></i>
          </div>
          <div class="kpi-value">₹${s.toLocaleString("en-IN")}</div>
          <div class="kpi-sub">Combined Monthly Rent</div>
        </div>
      </div>

      <!-- Dashboard Grid Split -->
      <div class="admin-dashboard-split">
        
        <!-- Left: Quick Property Overview -->
        <div class="admin-card-box">
          <div class="admin-card-header">
            <h4 class="admin-card-title"><i class="fa-solid fa-list-check" style="color: var(--accent-emerald);"></i> Recent Property Listings</h4>
            <button class="btn-quick-admin-action" data-admin-tab-goto="properties">View All (${e.length})</button>
          </div>

          <!-- Desktop Data Table -->
          <div class="hide-mobile overflow-x-auto">
            <table class="admin-data-table">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Locality</th>
                  <th>Rent / Mo</th>
                  <th>Type</th>
                  <th>Flags</th>
                </tr>
              </thead>
              <tbody>
                ${e.slice(0,5).map(t=>`
                  <tr>
                    <td>
                      <div style="display: flex; align-items: center; gap: 0.65rem;">
                        <img src="${t.images[0]}" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;" />
                        <div>
                          <div style="font-weight: 700; font-size: 0.88rem;">${t.title}</div>
                          <div style="font-size: 0.75rem; color: var(--text-secondary);">${t.sqft} sqft | ${t.bhk}</div>
                        </div>
                      </div>
                    </td>
                    <td><span class="badge-locality">${t.locality}</span></td>
                    <td style="font-weight: 700; color: var(--accent-emerald);">₹${t.price.toLocaleString("en-IN")}</td>
                    <td><span style="font-size: 0.8rem; font-weight: 600;">${t.type}</span></td>
                    <td>
                      <div style="display: flex; gap: 0.25rem;">
                        ${t.isVerified?'<span class="mini-flag mini-flag-emerald">🛡️</span>':""}
                      </div>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>

          <!-- Mobile Card List Fallback -->
          <div class="show-mobile-flex flex-column gap-3">
            ${e.slice(0,4).map(t=>`
              <div class="mobile-dash-prop-card">
                <img src="${t.images[0]}" class="mobile-dash-prop-img" />
                <div class="mobile-dash-prop-info" style="min-width: 0; flex: 1;">
                  <div class="mobile-dash-prop-title" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${t.title}</div>
                  <div class="mobile-dash-prop-meta" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${t.locality} • ${t.bhk} • ${t.sqft} sqft</div>
                  <div class="mobile-dash-prop-price">₹${t.price.toLocaleString("en-IN")}/mo</div>
                </div>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Right: Proprietor Card & Actions -->
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <div class="admin-card-box">
            <h4 class="admin-card-title" style="margin-bottom: 1rem;">
              <i class="fa-solid fa-user-tie" style="color: var(--accent-emerald);"></i> Proprietor Details
            </h4>
            <div style="font-size: 0.9rem; line-height: 1.6;">
              <div><strong>Name:</strong> ${o.proprietor} (${o.role})</div>
              <div><strong>Phone:</strong> ${o.phone}</div>
              <div><strong>WhatsApp:</strong> ${o.whatsapp}</div>
              <div><strong>Email:</strong> ${o.email}</div>
              <div style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--text-secondary);"><strong>Office:</strong> ${o.address}</div>
            </div>
            <button class="nav-btn" data-admin-tab-goto="settings" style="width: 100%; margin-top: 1rem; justify-content: center; background: rgba(16,185,129,0.15); border: 1px solid #10b981; color: #10b981; font-size: 0.85rem;">
              <i class="fa-solid fa-pen-to-square"></i> Edit Proprietor Info
            </button>
          </div>

          <div class="admin-card-box">
            <h4 class="admin-card-title" style="margin-bottom: 0.85rem;">⚡ Quick Admin Actions</h4>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <button class="nav-btn nav-btn-primary" data-admin-tab-goto="add-property" style="justify-content: center; font-size: 0.85rem;">
                <i class="fa-solid fa-plus"></i> Post New Property
              </button>
              <button class="nav-btn" data-admin-tab-goto="leads" style="justify-content: center; font-size: 0.85rem; background: rgba(245,158,11,0.15); color: #f59e0b; border: 1px solid #f59e0b;">
                <i class="fa-solid fa-headset"></i> View ${i.length} Tenant Leads
              </button>
            </div>
          </div>
        </div>

      </div>
    `:a==="properties"?`
      <div class="admin-card-box">
        <div class="admin-properties-header-bar">
          <div>
            <h4 style="margin: 0; font-size: 1.2rem; font-weight: 800;">Manage Property Listings (${e.length})</h4>
            <p style="font-size: 0.82rem; color: var(--text-secondary); margin: 2px 0 0 0;">Toggle flags (Verified, 0% Brokerage, Featured) or delete properties.</p>
          </div>

          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;" class="full-width-mobile">
            <input 
              type="text" 
              id="admin-prop-search" 
              placeholder="Search property title, locality, floor..." 
              class="admin-search-input"
            />
            <select id="admin-prop-floor-filter" class="search-select" style="padding: 0.6rem 0.85rem; border-radius: 10px; font-size: 0.85rem; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary);">
              <option value="All">All Floors</option>
              <option value="Ground Floor">Ground Floor</option>
              <option value="1st Floor">1st Floor</option>
              <option value="2nd Floor">2nd Floor</option>
              <option value="3rd Floor">3rd Floor</option>
              <option value="3rd of 8">3rd of 8</option>
              <option value="4th Floor">4th Floor</option>
              <option value="5th Floor">5th Floor</option>
              <option value="Top Floor / Penthouse">Top Floor / Penthouse</option>
            </select>
            <button class="nav-btn nav-btn-primary" data-admin-tab-goto="add-property" style="font-size: 0.85rem; white-space: nowrap;">
              <i class="fa-solid fa-plus"></i> Add Property
            </button>
          </div>
        </div>

        <!-- Desktop View Table -->
        <div class="hide-mobile overflow-x-auto">
          <table class="admin-data-table" id="admin-properties-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Locality</th>
                <th>Floor</th>
                <th>Rent / Deposit</th>
                <th>Furnishing</th>
                <th>Verified</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${e.map(t=>`
                <tr data-prop-row-id="${t.id}">
                  <td>
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                      <img src="${t.images[0]}" style="width: 48px; height: 48px; border-radius: 10px; object-fit: cover;" />
                      <div>
                        <div style="font-weight: 700; font-size: 0.9rem;">${t.title}</div>
                        <div style="font-size: 0.78rem; color: var(--text-secondary);">${t.bhk} | Floor: <strong style="color: var(--text-primary);">${t.floor||"Ground Floor"}</strong> | ${t.sqft} sqft | Owner: ${t.ownerName}</div>
                      </div>
                    </div>
                  </td>
                  <td><span class="badge-locality">${t.locality}</span></td>
                  <td>
                    <select class="admin-floor-select" data-prop-id="${t.id}" style="padding: 0.35rem 0.6rem; border-radius: 8px; font-size: 0.8rem; font-weight: 600; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); cursor: pointer;" title="Change Floor Option">
                      ${!["Ground Floor","1st Floor","2nd Floor","3rd Floor","3rd of 8","4th Floor","5th Floor","Top Floor / Penthouse"].includes(t.floor)&&t.floor?`<option value="${t.floor}" selected>${t.floor}</option>`:""}
                      <option value="Ground Floor" ${t.floor==="Ground Floor"?"selected":""}>Ground Floor</option>
                      <option value="1st Floor" ${t.floor==="1st Floor"?"selected":""}>1st Floor</option>
                      <option value="2nd Floor" ${t.floor==="2nd Floor"?"selected":""}>2nd Floor</option>
                      <option value="3rd Floor" ${t.floor==="3rd Floor"?"selected":""}>3rd Floor</option>
                      <option value="3rd of 8" ${t.floor==="3rd of 8"?"selected":""}>3rd of 8</option>
                      <option value="4th Floor" ${t.floor==="4th Floor"?"selected":""}>4th Floor</option>
                      <option value="5th Floor" ${t.floor==="5th Floor"?"selected":""}>5th Floor</option>
                      <option value="Top Floor / Penthouse" ${t.floor==="Top Floor / Penthouse"?"selected":""}>Top Floor / Penthouse</option>
                    </select>
                  </td>
                  <td>
                    <div style="font-weight: 800; color: var(--accent-emerald);">₹${t.price.toLocaleString("en-IN")}/mo</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">Dep: ₹${t.deposit.toLocaleString("en-IN")}</div>
                  </td>
                  <td><span style="font-size: 0.82rem;">${t.furnishing}</span></td>
                  <td>
                    <button class="flag-toggle-btn ${t.isVerified?"active":""}" data-flag-prop="${t.id}" data-flag-name="isVerified">
                      ${t.isVerified?"🛡️ Verified":"Unverified"}
                    </button>
                  </td>
                  <td>
                    <div style="display: flex; gap: 0.4rem;">
                      <button class="btn-admin-edit" data-edit-prop="${t.id}" title="Edit Property Details">
                        <i class="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button class="btn-admin-del" data-del-prop="${t.id}" title="Delete Property">
                        <i class="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>

        <!-- Mobile Card List View -->
        <div class="show-mobile-flex flex-column gap-3">
          ${e.map(t=>`
            <div class="admin-mobile-manage-card" data-mobile-prop-card="${t.id}">
              <div style="display: flex; gap: 0.75rem; align-items: center;">
                <img src="${t.images[0]}" style="width: 56px; height: 56px; border-radius: 10px; object-fit: cover; flex-shrink: 0;" />
                <div style="flex: 1; min-width: 0;">
                  <div style="font-weight: 800; font-size: 0.88rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${t.title}</div>
                  <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${t.locality} • ${t.bhk} • ${t.sqft} sqft</div>
                  <div style="display: flex; align-items: center; gap: 0.35rem; margin-top: 4px;">
                    <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 700;">FLOOR:</span>
                    <select class="admin-floor-select" data-prop-id="${t.id}" style="padding: 0.2rem 0.45rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary);">
                      ${!["Ground Floor","1st Floor","2nd Floor","3rd Floor","3rd of 8","4th Floor","5th Floor","Top Floor / Penthouse"].includes(t.floor)&&t.floor?`<option value="${t.floor}" selected>${t.floor}</option>`:""}
                      <option value="Ground Floor" ${t.floor==="Ground Floor"?"selected":""}>Ground Floor</option>
                      <option value="1st Floor" ${t.floor==="1st Floor"?"selected":""}>1st Floor</option>
                      <option value="2nd Floor" ${t.floor==="2nd Floor"?"selected":""}>2nd Floor</option>
                      <option value="3rd Floor" ${t.floor==="3rd Floor"?"selected":""}>3rd Floor</option>
                      <option value="3rd of 8" ${t.floor==="3rd of 8"?"selected":""}>3rd of 8</option>
                      <option value="4th Floor" ${t.floor==="4th Floor"?"selected":""}>4th Floor</option>
                      <option value="5th Floor" ${t.floor==="5th Floor"?"selected":""}>5th Floor</option>
                      <option value="Top Floor / Penthouse" ${t.floor==="Top Floor / Penthouse"?"selected":""}>Top Floor / Penthouse</option>
                    </select>
                  </div>
                  <div style="font-weight: 800; color: var(--accent-emerald); margin-top: 2px; font-size: 0.88rem;">₹${t.price.toLocaleString("en-IN")}/mo</div>
                </div>
                <div style="display: flex; gap: 0.35rem; align-self: center; flex-shrink: 0;">
                  <button class="btn-admin-edit" data-edit-prop="${t.id}" title="Edit Property Details">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button class="btn-admin-del" data-del-prop="${t.id}" title="Delete Property">
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.65rem; padding-top: 0.65rem; border-top: 1px dashed var(--border-color);">
                <button class="flag-toggle-btn ${t.isVerified?"active":""}" data-flag-prop="${t.id}" data-flag-name="isVerified" style="padding: 0.35rem 0.75rem; font-size: 0.78rem;">
                  ${t.isVerified?"🛡️ Verified Listing":"Unverified Listing"}
                </button>
              </div>
            </div>
          `).join("")}
        </div>

      </div>
    `:a==="add-property"?`
      <div class="admin-card-box admin-form-container">
        <h4 style="margin: 0 0 0.5rem 0; font-size: 1.25rem; font-weight: 800; display: flex; align-items: center; gap: 0.5rem;">
          <i class="fa-solid fa-house-medical" style="color: var(--accent-emerald);"></i> Add New Property Listing
        </h4>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem;">
          Post a verified rental listing directly to the platform.
        </p>

        <form id="admin-add-prop-form" style="display: flex; flex-direction: column; gap: 1.25rem;">
          <div class="input-field-group">
            <label>Property Title / Headline</label>
            <input type="text" id="admin-p-title" placeholder="e.g. Prestige Heights 3BHK Luxury Apartment" required />
          </div>

          <div class="input-field-group">
            <label>Full Property Address</label>
            <input 
              type="text" 
              id="admin-p-address" 
              placeholder="e.g. Ground floor, Srinivas Residency, 2nd Main, KR Garden, Murugeshpalaya, Bangalore - 560017" 
              required 
            />
          </div>

          <div class="responsive-form-row">
            <div class="input-field-group">
              <label>Locality / Place Name</label>
              <input 
                type="text" 
                id="admin-p-locality" 
                placeholder="Type place (e.g. Indiranagar, Whitefield...)" 
                list="admin-localities-datalist" 
                required 
              />
              <datalist id="admin-localities-datalist">
                ${Q.map(t=>`<option value="${t}"></option>`).join("")}
              </datalist>
            </div>

            <div class="input-field-group">
              <label>BHK Type</label>
              <select id="admin-p-bhk" class="search-select">
                <option value="1bhk">1 BHK</option>
                <option value="2bhk" selected>2 BHK Apartment</option>
                <option value="3bhk">3 BHK</option>
                <option value="4bhk">4+ BHK / Villa / Godown</option>
              </select>
            </div>
          </div>

          <div class="responsive-form-row">
            <div class="input-field-group">
              <label>Monthly Rent (₹)</label>
              <input type="number" id="admin-p-price" placeholder="45000" min="5000" step="1000" inputmode="numeric" required />
            </div>

            <div class="input-field-group">
              <label>Security Deposit (₹)</label>
              <input type="number" id="admin-p-deposit" placeholder="180000" min="10000" step="5000" inputmode="numeric" required />
            </div>
          </div>

          <div class="responsive-form-row">
            <div class="input-field-group">
              <label>Built-up Area (Sq Ft)</label>
              <input type="number" id="admin-p-sqft" placeholder="1350" inputmode="numeric" required />
            </div>

            <div class="input-field-group">
              <label>Furnishing Status</label>
              <select id="admin-p-furnishing" class="search-select">
                <option value="Fully Furnished">Fully Furnished</option>
                <option value="Semi-Furnished" selected>Semi-Furnished</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>
            </div>
          </div>

          <div class="responsive-form-row">
            <div class="input-field-group">
              <label>Floor Level</label>
              <input 
                type="text" 
                id="admin-p-floor" 
                placeholder="e.g. 3rd of 8, Ground Floor, 2nd Floor" 
                list="admin-floor-datalist" 
                required 
              />
              <datalist id="admin-floor-datalist">
                <option value="Ground Floor"></option>
                <option value="1st Floor"></option>
                <option value="2nd Floor"></option>
                <option value="3rd of 8"></option>
                <option value="3rd Floor"></option>
                <option value="4th Floor"></option>
                <option value="5th Floor"></option>
                <option value="Top Floor / Penthouse"></option>
              </datalist>
            </div>

            <div class="input-field-group">
              <label>Facing (Direction)</label>
              <select id="admin-p-facing" class="search-select">
                <option value="East Facing" selected>East Facing</option>
                <option value="North Facing">North Facing</option>
                <option value="North-East Facing">North-East Facing</option>
                <option value="West Facing">West Facing</option>
                <option value="South Facing">South Facing</option>
                <option value="South-East Facing">South-East Facing</option>
                <option value="North-West Facing">North-West Facing</option>
                <option value="South-West Facing">South-West Facing</option>
              </select>
            </div>
          </div>

          <div class="input-field-group">
            <label style="font-weight: 700; margin-bottom: 0.5rem; display: block;">
              <i class="fa-solid fa-list-check" style="color: var(--accent-emerald);"></i> Society & Unit Amenities
            </label>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0.65rem; background: var(--bg-input); padding: 0.85rem; border-radius: 12px; border: 1px solid var(--border-color);">
              <label style="display: flex; align-items: center; gap: 0.55rem; cursor: pointer; font-size: 0.9rem; font-weight: 600; color: var(--text-primary); user-select: none;">
                <input type="checkbox" name="admin-amenity" value="Power Backup" checked style="width: 18px; height: 18px; accent-color: var(--accent-emerald); cursor: pointer;" />
                <span><i class="fa-solid fa-bolt" style="color: #f59e0b; width: 16px;"></i> Power Backup</span>
              </label>
              <label style="display: flex; align-items: center; gap: 0.55rem; cursor: pointer; font-size: 0.9rem; font-weight: 600; color: var(--text-primary); user-select: none;">
                <input type="checkbox" name="admin-amenity" value="Lift" checked style="width: 18px; height: 18px; accent-color: var(--accent-emerald); cursor: pointer;" />
                <span><i class="fa-solid fa-elevator" style="color: var(--accent-indigo); width: 16px;"></i> Lift</span>
              </label>
              <label style="display: flex; align-items: center; gap: 0.55rem; cursor: pointer; font-size: 0.9rem; font-weight: 600; color: var(--text-primary); user-select: none;">
                <input type="checkbox" name="admin-amenity" value="Car Parking" checked style="width: 18px; height: 18px; accent-color: var(--accent-emerald); cursor: pointer;" />
                <span><i class="fa-solid fa-square-parking" style="color: #3b82f6; width: 16px;"></i> Car Parking</span>
              </label>
              <label style="display: flex; align-items: center; gap: 0.55rem; cursor: pointer; font-size: 0.9rem; font-weight: 600; color: var(--text-primary); user-select: none;">
                <input type="checkbox" name="admin-amenity" value="24/7 Security" checked style="width: 18px; height: 18px; accent-color: var(--accent-emerald); cursor: pointer;" />
                <span><i class="fa-solid fa-shield-halved" style="color: var(--accent-emerald); width: 16px;"></i> 24/7 Security</span>
              </label>
            </div>
          </div>

          <div class="responsive-form-row">
            <div class="input-field-group">
              <label>Owner Name</label>
              <input type="text" id="admin-p-owner-name" placeholder="Owner full name" required />
            </div>

            <div class="input-field-group">
              <label>Owner Phone</label>
              <input type="tel" id="admin-p-owner-phone" placeholder="e.g. +91 98450 12345" inputmode="tel" required />
            </div>
          </div>

          <div class="input-field-group">
            <label style="font-weight: 700; display: block; margin-bottom: 0.35rem;">
              Upload Property Photos <span style="font-weight: 400; font-size: 0.8rem; color: var(--accent-emerald);">(Mobile Camera & Laptop HD)</span>
            </label>
            <input 
              type="file" 
              id="admin-p-file" 
              accept="image/*" 
              multiple 
              style="position: absolute; width: 0.1px; height: 0.1px; opacity: 0; overflow: hidden; z-index: -1;" 
            />
            <label for="admin-p-file" id="admin-p-upload-area" class="admin-dropzone-box" style="display: block; cursor: pointer; -webkit-tap-highlight-color: transparent;">
              <div style="font-size: 2.2rem; color: var(--accent-emerald); margin-bottom: 0.4rem;">
                <i class="fa-solid fa-cloud-arrow-up"></i>
              </div>
              <div style="font-weight: 700; font-size: 0.95rem; color: var(--text-primary);">
                Tap to Select from Mobile Camera / Gallery or Drag & Drop
              </div>
              <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.25rem;">
                ⚡ Auto-optimizes phone camera photos (JPEG, PNG, HEIC, WEBP)
              </div>
            </label>
            <div id="admin-p-upload-status" style="display: none; margin-top: 0.5rem; font-size: 0.85rem; color: var(--accent-emerald); font-weight: 600; text-align: center;"></div>
            <div id="admin-p-image-preview" style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 0.75rem;"></div>
          </div>

          <div class="input-field-group">
            <label>Property Description</label>
            <textarea id="admin-p-desc" rows="3" placeholder="Describe property features, floor level, amenities, nearby landmarks, etc." style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary);" required></textarea>
          </div>

          <button type="submit" class="nav-btn nav-btn-primary" style="justify-content: center; padding: 0.9rem; font-size: 1rem;">
            <i class="fa-solid fa-paper-plane"></i> Publish Property to Platform
          </button>
        </form>
      </div>
    `:a==="leads"?`
      <div class="admin-card-box">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <div>
            <h4 style="margin: 0; font-size: 1.2rem; font-weight: 800;">Tenant Leads & Inquiries (${i.length})</h4>
            <p style="font-size: 0.82rem; color: var(--text-secondary); margin: 2px 0 0 0;">Connect directly via WhatsApp or manage visit statuses.</p>
          </div>
        </div>

        <!-- Desktop View Table -->
        <div class="hide-mobile overflow-x-auto">
          <table class="admin-data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Tenant Name</th>
                <th>Contact</th>
                <th>Property Interest</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${i.length===0?'<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">No active tenant inquiries.</td></tr>':""}
              ${i.map(t=>`
                <tr>
                  <td><span style="font-size: 0.82rem; color: var(--text-muted);">${t.date}</span></td>
                  <td><strong>${t.tenantName}</strong></td>
                  <td>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                      <span style="font-weight: 700;">${t.tenantPhone}</span>
                      <a href="https://wa.me/${t.tenantPhone.replace(/\D/g,"")}?text=Hello%20${encodeURIComponent(t.tenantName)},%20this%20is%20V.%20RAMANA%20from%20The%20Bangalore%20Properties%20regarding%20${encodeURIComponent(t.propertyTitle)}." target="_blank" style="color: #25D366; font-size: 1.1rem;" title="WhatsApp Tenant">
                        <i class="fa-brands fa-whatsapp"></i>
                      </a>
                    </div>
                  </td>
                  <td>
                    <div style="font-size: 0.88rem; font-weight: 600;">${t.propertyTitle}</div>
                    <div style="font-size: 0.75rem; color: var(--accent-emerald);">${t.locality}</div>
                  </td>
                  <td>
                    <select class="lead-status-select" data-lead-id="${t.id}">
                      <option value="New" ${t.status==="New"?"selected":""}>🔴 New Lead</option>
                      <option value="Contacted" ${t.status==="Contacted"?"selected":""}>🟡 Contacted</option>
                      <option value="Scheduled" ${t.status==="Scheduled"?"selected":""}>🔵 Visit Scheduled</option>
                      <option value="Closed" ${t.status==="Closed"?"selected":""}>🟢 Deal Closed</option>
                    </select>
                  </td>
                  <td>
                    <button class="btn-admin-del" data-del-lead="${t.id}" title="Delete Lead">
                      <i class="fa-solid fa-trash-can"></i>
                    </button>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>

        <!-- Mobile Card View -->
        <div class="show-mobile-flex flex-column gap-3">
          ${i.length===0?'<div style="text-align: center; color: var(--text-muted); padding: 1.5rem;">No active tenant inquiries.</div>':""}
          ${i.map(t=>`
            <div class="admin-mobile-lead-card">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem;">
                <div style="min-width: 0; flex: 1;">
                  <div style="font-weight: 800; font-size: 0.9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${t.tenantName}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">${t.date}</div>
                </div>
                <button class="btn-admin-del" data-del-lead="${t.id}" style="flex-shrink: 0;" title="Delete Lead">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </div>

              <div style="margin: 0.5rem 0; font-size: 0.85rem; min-width: 0;">
                <div style="font-weight: 700; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${t.propertyTitle}</div>
                <div style="font-size: 0.75rem; color: var(--accent-emerald);">${t.locality}</div>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-top: 0.65rem; padding-top: 0.65rem; border-top: 1px dashed var(--border-color);">
                <a href="https://wa.me/${t.tenantPhone.replace(/\D/g,"")}?text=Hello%20${encodeURIComponent(t.tenantName)},%20this%20is%20V.%20RAMANA%20from%20The%20Bangalore%20Properties." target="_blank" class="nav-btn" style="background: rgba(37, 211, 102, 0.15); color: #25D366; border: 1px solid #25D366; font-size: 0.78rem; padding: 0.35rem 0.6rem; white-space: nowrap; flex-shrink: 0;">
                  <i class="fa-brands fa-whatsapp"></i> WhatsApp
                </a>

                <select class="lead-status-select" data-lead-id="${t.id}" style="flex: 1; min-width: 0; font-size: 0.78rem;">
                  <option value="New" ${t.status==="New"?"selected":""}>🔴 New</option>
                  <option value="Contacted" ${t.status==="Contacted"?"selected":""}>🟡 Contacted</option>
                  <option value="Scheduled" ${t.status==="Scheduled"?"selected":""}>🔵 Scheduled</option>
                  <option value="Closed" ${t.status==="Closed"?"selected":""}>🟢 Closed</option>
                </select>
              </div>
            </div>
          `).join("")}
        </div>

      </div>
    `:a==="settings"?`
      <div class="admin-card-box admin-form-container">
        <h4 style="margin: 0 0 0.5rem 0; font-size: 1.25rem; font-weight: 800; display: flex; align-items: center; gap: 0.5rem;">
          <i class="fa-solid fa-sliders" style="color: var(--accent-emerald);"></i> Proprietor Business Settings
        </h4>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem;">
          Update proprietor business contact details & office address.
        </p>

        <form id="admin-settings-form" style="display: flex; flex-direction: column; gap: 1.25rem;">
          <div class="responsive-form-row">
            <div class="input-field-group">
              <label>Proprietor Name</label>
              <input type="text" id="set-proprietor" value="${o.proprietor}" required />
            </div>

            <div class="input-field-group">
              <label>Role / Title</label>
              <input type="text" id="set-role" value="${o.role}" required />
            </div>
          </div>

          <div class="responsive-form-row">
            <div class="input-field-group">
              <label>Contact Phone Number</label>
              <input type="tel" id="set-phone" value="${o.phone}" required />
            </div>

            <div class="input-field-group">
              <label>WhatsApp Number</label>
              <input type="tel" id="set-whatsapp" value="${o.whatsapp}" required />
            </div>
          </div>

          <div class="input-field-group">
            <label>Business Email</label>
            <input type="email" id="set-email" value="${o.email}" required />
          </div>

          <div class="input-field-group">
            <label>Office Address</label>
            <textarea id="set-address" rows="2" style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary);" required>${o.address}</textarea>
          </div>

          <div class="input-field-group">
            <label>Business Slogan</label>
            <input type="text" id="set-slogan" value="${o.slogan}" required />
          </div>

          <button type="submit" class="nav-btn nav-btn-primary" style="justify-content: center; padding: 0.9rem; font-size: 1rem;">
            <i class="fa-solid fa-floppy-disk"></i> Save Proprietor Settings
          </button>
        </form>

      </div>
    `:""}function me(a,e){var o,s;if(e.querySelectorAll("[data-admin-tab-goto]").forEach(l=>{l.addEventListener("click",()=>{r.setAdminTab(l.dataset.adminTabGoto);const t=e.querySelector(".admin-body-container");t&&(t.scrollTop=0)})}),a==="properties"){const l=document.getElementById("admin-prop-search"),t=document.getElementById("admin-prop-floor-filter"),u=()=>{const c=(l==null?void 0:l.value.toLowerCase().trim())||"",m=(t==null?void 0:t.value)||"All";e.querySelectorAll("#admin-properties-table tbody tr").forEach(p=>{var v;const n=p.innerText.toLowerCase(),d=!c||n.includes(c),f=((v=p.querySelector(".admin-floor-select"))==null?void 0:v.value)||"",b=m==="All"||f.toLowerCase()===m.toLowerCase();p.style.display=d&&b?"":"none"}),e.querySelectorAll("[data-mobile-prop-card]").forEach(p=>{var v;const n=p.innerText.toLowerCase(),d=!c||n.includes(c),f=((v=p.querySelector(".admin-floor-select"))==null?void 0:v.value)||"",b=m==="All"||f.toLowerCase()===m.toLowerCase();p.style.display=d&&b?"":"none"})};l==null||l.addEventListener("input",u),t==null||t.addEventListener("change",u),e.querySelectorAll(".admin-floor-select").forEach(c=>{c.addEventListener("change",async()=>{const m=c.dataset.propId,p=c.value;await r.updatePropertyFloor(m,p),$(`🏢 Floor updated to "${p}"!`)})}),e.querySelectorAll(".flag-toggle-btn").forEach(c=>{c.addEventListener("click",()=>{const m=c.dataset.flagProp,p=c.dataset.flagName;r.togglePropertyFlag(m,p),$(`Updated ${p} flag!`)})}),e.querySelectorAll("[data-del-prop]").forEach(c=>{c.addEventListener("click",async()=>{const m=c.dataset.delProp;if(confirm("Are you sure you want to delete this property listing?")){const p=await r.deleteProperty(m);p&&p.success?$("🗑️ Property deleted successfully from Cloud DB."):$(`❌ Delete failed: ${(p==null?void 0:p.error)||"Unauthorized"}. Please re-login as Admin.`)}})}),e.querySelectorAll("[data-edit-prop]").forEach(c=>{c.addEventListener("click",()=>{const m=c.dataset.editProp,p=r.allProperties.find(n=>String(n.id)===String(m));p&&r.openModal("edit-property",p)})})}if(a==="add-property"){let n=function(){if(u){if(m.length===0){u.innerHTML="";return}u.innerHTML=m.map((d,f)=>{const b=typeof d=="string"?d:d.dataUrl,v=d.compressedSize?`${Math.round(d.compressedSize/1024)} KB`:"";return`
          <div style="position: relative; display: inline-block; margin: 4px;">
            <img src="${b}" style="width: 84px; height: 84px; border-radius: 12px; object-fit: cover; border: 2px solid var(--accent-emerald); display: block;" />
            ${v?`<span style="position: absolute; bottom: 4px; left: 4px; background: rgba(0,0,0,0.75); color: #fff; font-size: 0.65rem; padding: 1px 4px; border-radius: 4px; font-weight: 700;">${v}</span>`:""}
            <button type="button" class="btn-remove-img" data-img-idx="${f}" style="position: absolute; top: -8px; right: -8px; width: 28px; height: 28px; border-radius: 50%; background: #ef4444; color: #fff; border: 2px solid #fff; font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.5); z-index: 10; touch-action: manipulation;" title="Remove Image">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        `}).join(""),u.querySelectorAll("[data-img-idx]").forEach(d=>{d.addEventListener("click",f=>{f.preventDefault(),f.stopPropagation();const b=Number(d.dataset.imgIdx);m.splice(b,1),n()})})}};var i=n;const l=document.getElementById("admin-p-file"),t=document.getElementById("admin-p-upload-area"),u=document.getElementById("admin-p-image-preview"),c=document.getElementById("admin-p-upload-status");let m=[];t==null||t.addEventListener("dragover",d=>{d.preventDefault(),t.style.borderColor="var(--accent-emerald)",t.style.background="rgba(16, 185, 129, 0.15)"}),t==null||t.addEventListener("dragleave",()=>{t.style.borderColor="var(--accent-emerald)",t.style.background="rgba(16, 185, 129, 0.05)"}),t==null||t.addEventListener("drop",d=>{var f;d.preventDefault(),t.style.background="rgba(16, 185, 129, 0.05)",(f=d.dataTransfer.files)!=null&&f.length&&p(Array.from(d.dataTransfer.files))}),l==null||l.addEventListener("change",d=>{var f;(f=d.target.files)!=null&&f.length&&p(Array.from(d.target.files))});async function p(d){if(!(!d||d.length===0)){c&&(c.style.display="block",c.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Optimizing mobile photos for fast upload...');try{const f=await X(d,(b,v)=>{c&&(c.innerHTML=`<i class="fa-solid fa-spinner fa-spin"></i> Optimizing photo ${b} of ${v}...`)});f.forEach(b=>{m.push(b)}),c&&(c.innerHTML=`✅ ${f.length} photo(s) optimized & ready!`,setTimeout(()=>{c&&(c.style.display="none")},2500))}catch(f){console.error("Error processing mobile images:",f),$("⚠️ Could not process image, please try another file."),c&&(c.style.display="none")}n()}}(o=document.getElementById("admin-add-prop-form"))==null||o.addEventListener("submit",async d=>{var x,I;d.preventDefault();const f=d.target.querySelector('button[type="submit"]');f&&(f.disabled=!0,f.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Saving property...');const b=document.getElementById("admin-p-title").value,v=document.getElementById("admin-p-address").value,P=document.getElementById("admin-p-locality").value,T=document.getElementById("admin-p-bhk").value,N=T==="1bhk"?"1 BHK":T==="2bhk"?"2 BHK":T==="3bhk"?"3 BHK":"4+ BHK",_=Number(document.getElementById("admin-p-price").value),O=Number(document.getElementById("admin-p-deposit").value),j=Number(document.getElementById("admin-p-sqft").value),g=document.getElementById("admin-p-furnishing").value,S=document.getElementById("admin-p-owner-name").value,A=document.getElementById("admin-p-owner-phone").value,B=document.getElementById("admin-p-desc").value,w=((x=document.getElementById("admin-p-floor"))==null?void 0:x.value.trim())||"3rd Floor",k=((I=document.getElementById("admin-p-facing"))==null?void 0:I.value)||"East Facing",F=Array.from(document.querySelectorAll('input[name="admin-amenity"]:checked')).map(z=>z.value),E=`prop-custom-${Date.now()}`;let y=[];if(m.length>0)for(let z=0;z<m.length;z++){const L=m[z],h=typeof L=="string"?L:L.dataUrl,H=typeof L=="object"&&L.fileName?L.fileName:`admin-photo-${z+1}.jpg`,R=typeof L=="object"&&L.mimeType?L.mimeType:"image/jpeg";f&&(f.innerHTML=`<i class="fa-solid fa-spinner fa-spin"></i> Uploading photo ${z+1} of ${m.length}...`);try{const D=await C.uploadImage(h,E,H,R);D&&D.url?y.push(D.url):y.push(h)}catch(D){console.warn("Image upload fallback to dataUrl:",D),y.push(h)}}else y=["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"];f&&(f.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Storing property...'),await r.addProperty({id:E,title:b,locality:P,address:v,price:_,deposit:O,bhk:N,bhkType:T,type:"Apartment",furnishing:g,sqft:j,bathrooms:2,floor:w,facing:k,availableFrom:"Immediate",preferredTenants:"Any",images:y,amenities:F.length>0?F:["Power Backup","Lift","Car Parking","24/7 Security"],description:B,ownerName:S,ownerPhone:A,ownerType:"Direct Owner"}),$(`✨ Property "${b}" published successfully!`),r.setAdminTab("properties")})}a==="leads"&&(e.querySelectorAll(".lead-status-select").forEach(l=>{l.addEventListener("change",t=>{const u=l.dataset.leadId;r.updateLeadStatus(u,t.target.value),$(`Updated lead status to ${t.target.value}`)})}),e.querySelectorAll("[data-del-lead]").forEach(l=>{l.addEventListener("click",()=>{const t=l.dataset.delLead;confirm("Delete this tenant lead?")&&(r.deleteLead(t),$("Lead deleted."))})})),a==="settings"&&((s=document.getElementById("admin-settings-form"))==null||s.addEventListener("submit",l=>{l.preventDefault();const t=document.getElementById("set-proprietor").value,u=document.getElementById("set-role").value,c=document.getElementById("set-phone").value,m=document.getElementById("set-whatsapp").value,p=document.getElementById("set-email").value,n=document.getElementById("set-address").value,d=document.getElementById("set-slogan").value,f=c.replace(/\D/g,""),b=f.length===10?`+91${f}`:`+${f}`;r.updateContactInfo({proprietor:t,role:u,phone:c,phoneRaw:b,whatsapp:m,email:p,address:n,slogan:d}),$("💾 Proprietor settings updated across the site!")}))}function ue(){var i;const a=document.getElementById("footer-root");if(!a)return;const e=r.contactInfo;a.innerHTML=`
    <div style="max-width: 1400px; margin: 0 auto; text-align: left; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; margin-bottom: 2rem; width: 100%;">
      <div>
        <div class="brand-logo" style="margin-bottom: 1rem;">
          <div class="brand-icon">
            <i class="fa-solid fa-city"></i>
          </div>
          <div>The Bangalore <span class="brand-text-highlight">Properties</span></div>
        </div>
        <p style="color: #f59e0b; font-size: 0.85rem; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 0.5rem;">
          "${e.slogan}"
        </p>
        <p style="color: var(--text-secondary); font-size: 0.85rem; line-height: 1.6;">
          Bengaluru's premier property platform directly managed by Proprietor V. RAMANA. Verified rental homes, office spaces, godowns & leases across Silicon Valley of India.
        </p>
      </div>

      <div>
        <h4 class="font-heading" style="color: var(--text-primary); margin-bottom: 1rem;">Services & Categories</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.85rem; color: var(--text-secondary);">
          <li><a href="#" class="footer-link"><i class="fa-solid fa-house" style="color: var(--accent-emerald);"></i> Residential Homes for Rent</a></li>
          <li><a href="#" class="footer-link"><i class="fa-solid fa-file-contract" style="color: var(--accent-amber);"></i> Long-term Property Lease</a></li>
          <li><a href="#" class="footer-link"><i class="fa-solid fa-key" style="color: var(--accent-indigo);"></i> Property Sale & Investments</a></li>
          <li><a href="#" class="footer-link"><i class="fa-solid fa-building" style="color: #3b82f6;"></i> Commercial Office Spaces</a></li>
          <li><a href="#" class="footer-link"><i class="fa-solid fa-warehouse" style="color: #ec4899;"></i> Industrial & Godown Spaces</a></li>
        </ul>
      </div>

      <div>
        <h4 class="font-heading" style="color: var(--text-primary); margin-bottom: 1rem;">Popular Localities</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.85rem; color: var(--text-secondary);">
          <li><a href="#" class="footer-link">Murugeshpalaya & EGL Tech Park</a></li>
          <li><a href="#" class="footer-link">Indiranagar 100ft Road</a></li>
          <li><a href="#" class="footer-link">Koramangala 5th Block</a></li>
          <li><a href="#" class="footer-link">HSR Layout Sector 1</a></li>
          <li><a href="#" class="footer-link">Whitefield near ITPL</a></li>
        </ul>
      </div>

      <div>
        <h4 class="font-heading" style="color: var(--text-primary); margin-bottom: 1rem;">Direct Contact (Proprietor)</h4>
        <div style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.8; margin-bottom: 1rem;">
          <div style="font-weight: 800; color: var(--text-primary); font-size: 0.95rem; margin-bottom: 0.25rem;">
            👤 ${e.proprietor} <span style="font-size: 0.75rem; color: #f59e0b; font-weight: 600;">(${e.role})</span>
          </div>
          <div>📍 ${e.address}</div>
          <div>📧 <a href="mailto:${e.email}" style="color: var(--accent-emerald); hover: underline;">${e.email}</a></div>
          <div>📞 <a href="tel:${e.phoneRaw}" style="color: #f59e0b; font-weight: 700;">${e.phone}</a></div>
        </div>
        <div style="display: flex; gap: 0.75rem; font-size: 1.2rem;">
          <a href="https://wa.me/${e.whatsapp.replace("+","")}" target="_blank" style="color: #25D366;" title="WhatsApp Direct"><i class="fa-brands fa-whatsapp"></i></a>
          <a href="tel:${e.phoneRaw}" style="color: var(--accent-emerald);" title="Call Direct"><i class="fa-solid fa-phone"></i></a>
          <a href="mailto:${e.email}" style="color: var(--accent-amber);" title="Email Direct"><i class="fa-solid fa-envelope"></i></a>
          <button id="footer-btn-contact-modal" style="color: var(--accent-indigo); cursor: pointer; border: none; background: none; font-size: 1.2rem;" title="View Digital Business Card"><i class="fa-solid fa-id-card"></i></button>
        </div>
      </div>
    </div>

    <div style="border-top: 1px solid var(--border-color); padding-top: 1.5rem; font-size: 0.8rem; color: var(--text-muted); display: flex; flex-wrap: wrap; justify-content: space-between; gap: 1rem; align-items: center;">
      <div>
        © ${new Date().getFullYear()} The Bangalore Properties. All rights reserved. Managed by <strong>V. RAMANA (Proprietor)</strong>.
      </div>
      <div style="color: #10b981; font-weight: 700; letter-spacing: 0.5px;">
        <i class="fa-solid fa-key"></i> 100% VERIFIED RENTAL LISTINGS ONLY
      </div>
    </div>
  `,(i=document.getElementById("footer-btn-contact-modal"))==null||i.addEventListener("click",()=>{r.openModal("contact-us")})}let W=!1;function J(){const a=document.activeElement,e=a&&(a.id==="hero-place-search-input"||a.id==="filter-search-input");if(ae(),(!e||!W)&&(ee(),te(),ie(),ue()),oe(),se(),le(),ne(),document.body.classList.toggle("modal-open",!!r.activeModal),a&&document.body.contains(a))try{a.focus()}catch{}W=!0}function K(){const a=window.location.pathname.toLowerCase().replace(/\/$/,""),e=window.location.hash.toLowerCase();(a==="/admin"||e==="#admin"||e==="#/admin")&&r.activeModal!=="admin-portal"&&r.openModal("admin-portal")}function Y(){var a;document.documentElement.setAttribute("data-theme",r.theme),K(),window.addEventListener("popstate",K),window.addEventListener("hashchange",K),J(),(a=document.getElementById("floating-btn-book-call"))==null||a.addEventListener("click",()=>{r.openModal("book-call")}),r.subscribe(()=>{J()})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Y):Y();
