// components/DebugTest.tsx
'use client'

export default function DebugTest() {
  const testDirectDOM = () => {
    // Isso pode causar o erro que você está vendo
    const div = document.createElement('div');
    document.body.appendChild(div);
    setTimeout(() => {
      document.body.removeChild(div); // Isso deve funcionar
      // Mas se o React tentar remover o mesmo div, causa erro
    }, 1000);
  };

  return (
    <div>
      <button onClick={testDirectDOM} className="p-4 bg-red-500 text-white">
        Testar Manipulação DOM
      </button>
    </div>
  );
}