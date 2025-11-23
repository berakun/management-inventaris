<template>
    <div class="relative inline-block text-left">
        <button 
            @click="isOpen = !isOpen"
            class="inline-flex justify-center items-center h-8 w-8 text-xl text-gray-700 bg-transparent hover:bg-gray-100 rounded-full focus:outline-none transition duration-150"
            type="button"
        >
            ...
        </button>

        <div 
            v-if="isOpen"
            class="origin-top-right absolute right-0 mt-2 w-32 rounded-lg shadow-2xl bg-black 
                   ring-1 ring-black ring-opacity-5 focus:outline-none z-30" 
            ref="dropdownMenu"
        >
            <div class="py-1">
                <button 
                    @click="selectAction('edit')"
                    class="block w-full text-left px-4 py-2 text-sm text-white hover:bg-indigo-600 transition duration-100"
                >
                    Edit
                </button>
                
                <button 
                    @click="selectAction('delete')"
                    class="block w-full text-left px-4 py-2 text-sm text-white hover:bg-indigo-600 transition duration-100"
                >
                    Delete
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const emit = defineEmits(['action']);
const isOpen = ref(false);
const dropdownMenu = ref(null); // ✅ Ref untuk elemen menu

const selectAction = (action) => {
    emit('action', action);
    isOpen.value = false; // Tutup menu setelah aksi dipilih
};

// ✅ FUNGSI CLICK-OUTSIDE
const handleClickOutside = (event) => {
    // Jika menu terbuka DAN elemen yang diklik BUKAN bagian dari menu
    if (isOpen.value && dropdownMenu.value && !dropdownMenu.value.contains(event.target)) {
        // Cek juga tombolnya, agar klik tombol tidak menutupnya
        if (!event.target.closest('button')) { 
            isOpen.value = false;
        }
    }
};

onMounted(() => {
    // Tambahkan event listener saat komponen dimuat
    document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
    // Hapus event listener saat komponen dihancurkan
    document.removeEventListener('click', handleClickOutside);
});
</script>