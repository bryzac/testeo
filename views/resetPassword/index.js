const container = document.querySelector('#container');

(() => {
    const token = window.location.pathname.split('/resetPassword/')[1];

    if (!token) {
        container.innerHTML= `
        <form class="flex flex-col p-4 rounded-lg gap-4 bg-zinc-200 shadow-lg">
            <h1 class="text-lg">Escribe tu correo para la verificación de la contraseña</h1>
            <label for="email-input" class="font-bold">Email</label>
            <input type="email" id="email-input" class="rounded-lg p-2 bg-zinc-100 focus:outline-slate-700">
            <button 
                class="bg-slate-700 py-2 px-4 rounded-lg font-bold text-white hover:bg-slate-400 text-center transition ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black"
            >
                Enviar correo
            </button>
        </form>
        `;

        
    };
    console.log(token);
})();

const form = container.children[0];
const emailInput = form.children[2];


form.addEventListener('submit', async e => {
    e.preventDefault();

    try {
        const email = { email: emailInput.value }
        const { data } = await axios.post('/api/resetPassword', email);
        container.innerHTML = `
        <div class="flex flex-col p-4 rounded-lg gap-4 bg-zinc-200 shadow-lg">
            <h1 class="text-lg">Se te ha enviado un correo electrónico para reiniciar contraseña</h1>
            
            
        </div>
        `;

    } catch (error) {
        console.log(error);
    }
})