'use client';

import React, { useEffect, useMemo, useRef, useState } from "react";

// =============================================
// SITE DE CASAMENTO MODERNO — ANDRÉ & MARILENE
// =============================================

const WEDDING_INFO = {
  coupleA: "André",
  coupleB: "Marilene",
  dateLong: "06 de dezembro de 2025, às 18h30",
  ceremonyPlace: "Paróquia São Bento — QS 305 Conj. 1 Lote 1/4, Samambaia, Brasília - DF",
  receptionPlace: "Salão de Festas – Residencial Rio Paranã — Qd. 301 Conj. 01 Lote 06",
  bgMusicSrc: "/ceu de santo amaro.mp3",
};

const guestDirectory: { name: string; dependents: string[] }[] = [
  { name: "Lucas Santos", dependents: ["Maria Eduarda", "João Pedro"] },
  { name: "Maria Oliveira", dependents: ["Carlos (marido)"] },
  { name: "Familia Santos", dependents: ["Marcos", "Letícia", "Miguel"] },
  { name: "Paulo Souza", dependents: [] },
  { name: "Fernanda Lima", dependents: ["Davi", "Luna"] },
];

const cls = (...arr: (string | false | null | undefined)[]) => arr.filter(Boolean).join(" ");

function normalizeText(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}
function fuzzyIncludes(hay: string, needle: string) {
  return normalizeText(hay).includes(normalizeText(needle));
}
function rowsToCSV(rows: (string | number)[][]): string {
  const escapeCell = (v: string | number) => `"${String(v).replaceAll('"', '""')}"`;  return rows.map(r => r.map(escapeCell).join(",")).join("\n");
}

interface RSVPItem {
  name: string;
  going: "sim" | "nao";
  selectedDependents: string[];
  message?: string;
  timestamp: string;
}

// Movendo a função exportCSV para o escopo global
function exportCSV() {
  const saved = JSON.parse(localStorage.getItem("wedding_rsvps") || "[]") as RSVPItem[];
  const rows = [
    ["timestamp", "name", "going", "dependents", "message"],
    ...saved.map(r => [
      r.timestamp,
      r.name,
      r.going,
      r.selectedDependents.join(" | "),
      (r.message ?? "").replace(/\r?\n/g, " "),
    ]),
  ];
  const csv = rowsToCSV(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "rsvps.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function Section({ id, title, subtitle, children }: { id: string; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#b8860b] mb-3 sm:mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm sm:text-base lg:text-lg text-[#3d5a40]/80 max-w-2xl mx-auto leading-relaxed px-4">
              {subtitle}
            </p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}

function Hero() {
  const [heroImage, setHeroImage] = useState<string>("/DSCN5339.JPG"); // Valor padrão direto
  const [isClient, setIsClient] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setHeroImage(result);
        if (isClient) {
          localStorage.setItem("wedding_hero_image", result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Carregar imagem salva do localStorage apenas no cliente
  useEffect(() => {
    setIsClient(true);
    const savedImage = localStorage.getItem("wedding_hero_image");
    if (savedImage) {
      setHeroImage(savedImage);
    }
  }, []);

  return (
    <header className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f6f3] via-white to-[#f5f2ef] py-4 sm:py-8">
      {/* Elementos decorativos de fundo - ajustados para mobile */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-4 left-4 sm:top-10 sm:left-10 w-16 h-16 sm:w-32 sm:h-32 opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full text-[#d4b483]">
            <path d="M50 10 C30 10, 10 30, 10 50 C10 70, 30 90, 50 90 C70 90, 90 70, 90 50 C90 30, 70 10, 50 10 Z" 
                  fill="none" stroke="currentColor" strokeWidth="1"/>
            <path d="M20 20 Q50 5, 80 20 Q85 50, 80 80 Q50 95, 20 80 Q5 50, 20 20" 
                  fill="currentColor" opacity="0.1"/>
          </svg>
        </div>
      </div>
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Layout mobile-first: coluna única em mobile, duas colunas em desktop */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          
          {/* Lado esquerdo - Texto */}
          <div className="text-center lg:text-left space-y-4 sm:space-y-6 order-2 lg:order-1">
            {/* Texto introdutório */}
            <div className="inline-block">
              <p className="text-xs sm:text-sm md:text-base text-[#b8860b] font-normal tracking-wide mb-2 sm:mb-4 px-2 leading-relaxed">
                Depois de 29 anos de amor,
                companheirismo e sonhos
                compartilhados,
              </p>
            </div>
            
            {/* Nomes dos noivos - responsivos com fonte menor para caber em uma linha */}
            <div className="space-y-1 sm:space-y-2">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-[#3d5a40] leading-none" style={{ fontFamily: 'Imperial Script, cursive' }}>
                André Ricardo
              </h1>
              <div className="flex items-center justify-center lg:justify-start">
                <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-[#3d5a40]" style={{ fontFamily: 'Imperial Script, cursive' }}>&</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-[#3d5a40] leading-none" style={{ fontFamily: 'Imperial Script, cursive' }}>
                Marilene
              </h1>
            </div>
            
            {/* Texto do convite */}
            <div className="pt-4">
              <p className="text-xs sm:text-sm md:text-base text-[#b8860b] font-normal tracking-wide leading-relaxed px-2">
                convidam você para celebrar, com bênçãos e
                alegria o momento especial da união matrimonial
                perante Deus e seus familiares.
              </p>
            </div>
            
            {/* Botão Confirmar - otimizado para mobile */}
            <div className="pt-4 sm:pt-6">
              <a 
                href="#rsvp" 
                className="inline-block px-6 sm:px-8 py-3 sm:py-4 border-2 border-[#b8860b] text-[#b8860b] hover:bg-[#b8860b] hover:text-white transition-all duration-300 rounded-full font-medium tracking-wide text-sm sm:text-base touch-manipulation"
              >
                CONFIRMAR PRESENÇA
              </a>
            </div>
          </div>
          
          {/* Lado direito - Foto - otimizada para mobile */}
          <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-none order-1 lg:order-2 flex justify-center">
            {heroImage ? (
              <div className="relative inline-block rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border-2 sm:border-4 border-white bg-white">
                <img 
                  src={heroImage} 
                  alt="André e Marilene" 
                  className="block max-w-full max-h-[400px] sm:max-h-[500px] lg:max-h-[600px] w-auto h-auto"
                />
              </div>
            ) : (
              <div className="aspect-[3/4] sm:aspect-[4/5] bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border-2 sm:border-4 border-white w-full">
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#f8f6f3] to-[#f0ede8] text-[#b8860b]/60 p-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 sm:h-16 sm:w-16 mb-3 sm:mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-center mb-3 sm:mb-4 font-medium text-sm sm:text-base">Adicione uma foto do casal</p>
                  <label className="cursor-pointer bg-[#b8860b] text-white px-4 sm:px-6 py-2 rounded-full font-medium hover:bg-[#a0750a] transition text-sm sm:text-base touch-manipulation">
                    Escolher Foto
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}
            
            {/* Elementos decorativos - ajustados para mobile */}
            <div className="absolute -top-2 -left-2 sm:-top-4 sm:-left-4 w-4 h-4 sm:w-8 sm:h-8 border-l-2 border-t-2 border-[#d4b483] opacity-60"></div>
            <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-4 h-4 sm:w-8 sm:h-8 border-r-2 border-t-2 border-[#d4b483] opacity-60"></div>
            <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 w-4 h-4 sm:w-8 sm:h-8 border-l-2 border-b-2 border-[#d4b483] opacity-60"></div>
            <div className="absolute -bottom-2 -right-2 sm:-bottom-4 sm:-right-4 w-4 h-4 sm:w-8 sm:h-8 border-r-2 border-b-2 border-[#d4b483] opacity-60"></div>
          </div>
        </div>
        
        {/* Informações do casamento - otimizadas para mobile */}
        <div className="mt-8 sm:mt-12 lg:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 text-center">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20">
            <div className="text-[#b8860b] text-lg sm:text-xl lg:text-2xl font-light mb-1 sm:mb-2">Quando</div>
            <div className="text-[#3d5a40] font-medium text-sm sm:text-base">{WEDDING_INFO.dateLong}</div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20 cursor-pointer hover:bg-white/80 transition-all duration-300 group">
            <a 
              href="https://maps.app.goo.gl/BVkaoRVroFhiH46s7" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full h-full"
            >
              <div className="text-[#b8860b] text-lg sm:text-xl lg:text-2xl font-light mb-1 sm:mb-2 group-hover:text-[#a0750a] transition-colors">
                Cerimônia
                <svg className="inline-block ml-2 w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="text-[#3d5a40] text-xs sm:text-sm leading-relaxed group-hover:text-[#2d4a30] transition-colors">
                {WEDDING_INFO.ceremonyPlace}
              </div>
            </a>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20 sm:col-span-2 lg:col-span-1 cursor-pointer hover:bg-white/80 transition-all duration-300 group">
            <a 
              href="https://maps.app.goo.gl/Svp4k85MrycLyLu26" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full h-full"
            >
              <div className="text-[#b8860b] text-lg sm:text-xl lg:text-2xl font-light mb-1 sm:mb-2 group-hover:text-[#a0750a] transition-colors">
                Recepção
                <svg className="inline-block ml-2 w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="text-[#3d5a40] text-xs sm:text-sm leading-relaxed group-hover:text-[#2d4a30] transition-colors">
                {WEDDING_INFO.receptionPlace}
              </div>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setIsClient(true);
    
    const tryAutoplay = async () => {
      const audio = audioRef.current;
      if (!audio) return;
      
      try {
        audio.volume = 0.3;
        await audio.play();
        setIsPlaying(true);
        localStorage.setItem("wedding_music_enabled", "true");
      } catch (error) {
        // Se autoplay falhar (política do navegador), não fazer nada
        console.log("Autoplay não permitido pelo navegador");
        setIsPlaying(false);
      }
    };

    // Verificar se havia música tocando antes (apenas no cliente)
    const saved = localStorage.getItem("wedding_music_enabled");
    if (saved === "true") {
      tryAutoplay();
    } else {
      // Tentar autoplay mesmo se não havia configuração salva
      setTimeout(tryAutoplay, 1000);
    }
  }, []);

  const toggle = async () => {
    if (!isClient) return;
    
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      localStorage.setItem("wedding_music_enabled", "false");
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
        localStorage.setItem("wedding_music_enabled", "true");
      } catch {
        // Falha silenciosa se autoplay não for permitido
      }
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      <button
        onClick={toggle}
        className="bg-[#b8860b] hover:bg-[#a0750a] text-white p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 touch-manipulation"
        aria-label={isPlaying ? "Pausar música" : "Tocar música"}
      >
        {isPlaying ? (
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        )}
      </button>
      <audio ref={audioRef} src={WEDDING_INFO.bgMusicSrc} loop />
    </div>
  );
}

interface PhotoWithDescription {
  file: File;
  description: string;
  id: string;
}

function Gallery() {
  const [photos, setPhotos] = useState<Array<{file: File, description: string, id: string}>>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempDescription, setTempDescription] = useState("");
  const [photoCounter, setPhotoCounter] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newPhotos = selectedFiles.map((file, index) => ({
      file,
      description: "",
      id: `photo_${photoCounter + index}_${file.name.replace(/[^a-zA-Z0-9]/g, '_')}`
    }));
    
    setPhotos(prev => [...prev, ...newPhotos]);
    setPhotoCounter(prev => prev + selectedFiles.length);
  };

  const updateDescription = (id: string, description: string) => {
    setPhotos(prev => prev.map(photo => 
      photo.id === id ? { ...photo, description } : photo
    ));
  };

  const removePhoto = (id: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== id));
  };

  const startEditing = (id: string, currentDescription: string) => {
    setEditingId(id);
    setTempDescription(currentDescription);
  };

  const saveDescription = (id: string) => {
    updateDescription(id, tempDescription);
    setEditingId(null);
    setTempDescription("");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setTempDescription("");
  };

  return (
    <Section id="galeria" title="Nossa História em Fotos" subtitle="Crie um álbum especial com fotos e descrições dos momentos mais importantes.">
      <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg">
        
        {/* Upload de fotos */}
        <div className="mb-6">
          <label className="block">
            <span className="text-sm font-medium text-[#3d5a40] mb-2 block">Adicionar Fotos ao Álbum</span>
            <input 
              type="file" 
              accept="image/*" 
              multiple
              className="mt-2 block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-[#b8860b] file:px-3 file:py-2 sm:file:px-4 sm:file:py-2 file:text-white hover:file:bg-[#a0750a] file:text-xs sm:file:text-sm touch-manipulation transition-colors"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {/* Galeria de fotos com descrições */}
        {photos.length > 0 ? (
          <div className="space-y-6">
            {photos.map((photo) => {
              const photoUrl = URL.createObjectURL(photo.file);
              return (
                <div key={photo.id} className="bg-white/50 rounded-xl p-4 shadow-sm border border-white/30">
                  <div className="flex flex-col lg:flex-row gap-4">
                    
                    {/* Imagem */}
                    <div className="lg:w-1/3">
                      <div className="aspect-square overflow-hidden rounded-lg shadow-md">
                        <img 
                          src={photoUrl} 
                          alt={photo.description || `Foto ${photo.id}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    
                    {/* Descrição e controles */}
                    <div className="lg:w-2/3 flex flex-col justify-between">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-[#3d5a40] mb-2">
                          Descrição da Foto
                        </label>
                        
                        {editingId === photo.id ? (
                          <div className="space-y-3">
                            <textarea
                              value={tempDescription}
                              onChange={(e) => setTempDescription(e.target.value)}
                              placeholder="Descreva este momento especial..."
                              className="w-full p-3 border border-[#a3c9a8] rounded-lg focus:ring-2 focus:ring-[#b8860b] focus:border-transparent resize-none"
                              rows={4}
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => saveDescription(photo.id)}
                                className="px-4 py-2 bg-[#b8860b] text-white rounded-lg hover:bg-[#a0750a] transition-colors text-sm font-medium"
                              >
                                Salvar
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="min-h-[100px] p-3 bg-white/70 border border-[#a3c9a8]/30 rounded-lg">
                              {photo.description ? (
                                <p className="text-[#3d5a40] leading-relaxed">{photo.description}</p>
                              ) : (
                                <p className="text-gray-500 italic">Clique em "Editar" para adicionar uma descrição...</p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => startEditing(photo.id, photo.description)}
                                className="px-4 py-2 bg-[#a3c9a8] text-white rounded-lg hover:bg-[#6a8e7f] transition-colors text-sm font-medium"
                              >
                                {photo.description ? "Editar" : "Adicionar Descrição"}
                              </button>
                              <button
                                onClick={() => removePhoto(photo.id)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                              >
                                Remover
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-6 sm:mt-8 p-8 sm:p-12 text-center text-black/60 border-2 border-dashed border-[#a3c9a8]/50 rounded-xl sm:rounded-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-[#a3c9a8]/70 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-medium text-[#3d5a40] mb-2">Seu Álbum de Casamento</h3>
            <p className="text-sm sm:text-base mb-4">Adicione fotos especiais e conte a história de cada momento.</p>
            <p className="text-xs sm:text-sm text-gray-500">Selecione as fotos acima para começar a criar seu álbum personalizado.</p>
          </div>
        )}
      </div>
    </Section>
  );
}

function RSVP() {
  const [query, setQuery] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [going, setGoing] = useState<RSVPItem["going"]>("sim");
  const [selectedDependents, setSelectedDependents] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState<RSVPItem | null>(null);
  const [isClient, setIsClient] = useState(false);

  const suggestions = useMemo(() => {
    if (!query) return [] as { name: string; dependents: string[] }[];
    return guestDirectory.filter(g => fuzzyIncludes(g.name, query)).slice(0, 6);
  }, [query]);

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem("wedding_rsvps");
    if (!saved) return;

    const savedRSVPs = JSON.parse(saved) as RSVPItem[];
    const myRSVP = savedRSVPs.find(r => r.name === selectedName);
    if (myRSVP) {
      setSubmitted(myRSVP);
    }
  }, [selectedName]);

  const currentDependents = useMemo(() => {
    const g = guestDirectory.find(g => g.name === selectedName);
    return g?.dependents || [];
  }, [selectedName]);

  useEffect(() => {
    setSelectedDependents([]);
  }, [selectedName]);

  function toggleDependent(dep: string) {
    setSelectedDependents(prev => prev.includes(dep) ? prev.filter(d => d !== dep) : [...prev, dep]);
  }

  function handlePick(name: string) {
    setSelectedName(name);
    setQuery(name);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedName) return alert("Por favor, digite e selecione seu nome.");
    if (!isClient) return;

    const record: RSVPItem = {
      name: selectedName,
      going,
      selectedDependents,
      message,
      timestamp: new Date().toISOString(),
    };

    const saved = JSON.parse(localStorage.getItem("wedding_rsvps") || "[]") as RSVPItem[];
    saved.push(record);
    localStorage.setItem("wedding_rsvps", JSON.stringify(saved));
    setSubmitted(record);
  }

  return (
    <Section id="rsvp" title="Confirmação de Presença" subtitle="Digite seu nome (conforme na lista) e selecione os dependentes.">
      {submitted ? (
        <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-lg text-center">
          <div className="w-16 h-16 bg-[#a3c9a8]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#3d5a40]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-[#3d5a40] mb-2">Obrigado pela confirmação!</h3>
          <p className="text-black/70 mb-6">Sua presença é muito importante para nós.</p>
          <div className="p-4 bg-[#f5f7f2] rounded-2xl text-left mb-6">
            <div><strong>Nome:</strong> {submitted.name}</div>
            <div><strong>Presença:</strong> {submitted.going === "sim" ? "Confirmada" : "Não poderei ir"}</div>
            {submitted.selectedDependents.length > 0 && (
              <div><strong>Acompanhantes:</strong> {submitted.selectedDependents.join(", ")}</div>
            )}
            {submitted.message && (
              <div className="mt-2"><strong>Mensagem:</strong> {submitted.message}</div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setSubmitted(null)}
            className="px-6 py-2 rounded-full bg-[#3d5a40] text-white hover:bg-[#6a8e7f] transition shadow"
          >
            Enviar outra confirmação
          </button>
        </div>
      ) : (
        <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-lg">
          <form className="grid gap-6" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm font-medium text-[#3d5a40] mb-2">Seu nome</label>
              <div className="relative">
                <input
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setSelectedName(""); }}
                  placeholder="Comece a digitar..."
                  className="w-full rounded-xl border border-[#a3c9a8] bg-white px-4 py-3 text-[#2b3a2e] outline-none focus:ring-2 focus:ring-[#6a8e7f]"
                  aria-label="Digite seu nome para buscar na lista de convidados"
                />
                {query && suggestions.length > 0 && (
                  <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-[#a3c9a8] bg-white shadow-lg">
                    {suggestions.map((s, idx) => (
                      <li key={idx}>
                        <button
                          type="button"
                          onClick={() => handlePick(s.name)}
                          className="w-full text-left px-4 py-3 hover:bg-[#f5f7f2] text-[#2b3a2e] transition"
                        >
                          {s.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {selectedName && (
                <p className="mt-2 text-sm text-[#3d5a40]">Selecionado: <span className="font-medium">{selectedName}</span></p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3d5a40] mb-2">Você irá?</label>
              <div className="flex flex-wrap gap-3">
                {(["sim", "nao"] as RSVPItem["going"][]).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setGoing(opt)}
                    className={cls(
                      "px-6 py-3 rounded-xl ring-1 shadow-sm transition",
                      going === opt
                        ? "bg-[#3d5a40] text-white ring-[#3d5a40]"
                        : "bg-white text-[#2b3a2e] ring-[#a3c9a8] hover:ring-[#6a8e7f]"
                    )}
                  >
                    {opt === "sim" ? "Sim, irei" : "Não poderei ir"}
                  </button>
                ))}
              </div>
            </div>

            {currentDependents.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-[#3d5a40] mb-2">
                  Acompanhantes ({selectedDependents.length}/{currentDependents.length})
                </label>
                <div className="grid gap-2">
                  {currentDependents.map((dep, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleDependent(dep)}
                      className={cls(
                        "flex items-center gap-2 px-4 py-3 rounded-xl ring-1 text-left transition",
                        selectedDependents.includes(dep)
                          ? "bg-[#f5f7f2] ring-[#6a8e7f]"
                          : "bg-white ring-[#a3c9a8] hover:ring-[#6a8e7f]"
                      )}
                    >
                      <div className={cls(
                        "w-5 h-5 rounded-md flex items-center justify-center transition",
                        selectedDependents.includes(dep)
                          ? "bg-[#3d5a40] text-white"
                          : "border border-[#a3c9a8]"
                      )}>
                        {selectedDependents.includes(dep) && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span>{dep}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#3d5a40] mb-2">Mensagem (opcional)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Deixe uma mensagem para os noivos..."
                rows={3}
                className="w-full rounded-xl border border-[#a3c9a8] bg-white px-4 py-3 text-[#2b3a2e] outline-none focus:ring-2 focus:ring-[#6a8e7f]"
              />
            </div>

            <div className="mt-4">
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 rounded-full bg-[#3d5a40] text-white hover:bg-[#6a8e7f] transition shadow-md"
              >
                Confirmar Presença
              </button>
            </div>
          </form>
        </div>
      )}
    </Section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#f5f7f2] py-12 mt-16">
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-serif text-[#3d5a40]">
            {WEDDING_INFO.coupleA} & {WEDDING_INFO.coupleB}
          </h2>
          <div className="h-1 w-24 mx-auto my-4 bg-gradient-to-r from-transparent via-[#d4b483] to-transparent"></div>
          <p className="text-black/70 mb-8">Agradecemos por compartilhar este momento especial conosco.</p>
          
          <div className="flex justify-center space-x-6 mb-8">
            <a href="#" className="text-[#3d5a40] hover:text-[#6a8e7f] transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="#" className="text-[#3d5a40] hover:text-[#6a8e7f] transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
              </svg>
            </a>
            <a href="#" className="text-[#3d5a40] hover:text-[#6a8e7f] transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
            </a>
          </div>
          
          <div className="text-sm text-black/50">
            <p>© 2025 André & Marilene. Todos os direitos reservados.</p>
            <button 
              onClick={exportCSV} 
              className="mt-4 text-xs text-[#3d5a40] hover:text-[#6a8e7f] transition"
            >
              Exportar RSVPs (CSV)
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const weddingDate = new Date('2025-12-06T19:00:00');
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = weddingDate.getTime() - now.getTime();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <Section id="countdown" title="Contagem Regressiva" subtitle="Tempo restante para o grande dia">
      <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-lg">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="bg-white/50 rounded-2xl p-6 shadow-sm">
            <div className="text-4xl md:text-5xl font-light text-[#3d5a40]">{timeLeft.days}</div>
            <div className="mt-2 text-sm md:text-base text-black/70">Dias</div>
          </div>
          <div className="bg-white/50 rounded-2xl p-6 shadow-sm">
            <div className="text-4xl md:text-5xl font-light text-[#3d5a40]">{timeLeft.hours}</div>
            <div className="mt-2 text-sm md:text-base text-black/70">Horas</div>
          </div>
          <div className="bg-white/50 rounded-2xl p-6 shadow-sm">
            <div className="text-4xl md:text-5xl font-light text-[#3d5a40]">{timeLeft.minutes}</div>
            <div className="mt-2 text-sm md:text-base text-black/70">Minutos</div>
          </div>
          <div className="bg-white/50 rounded-2xl p-6 shadow-sm">
            <div className="text-4xl md:text-5xl font-light text-[#3d5a40]">{timeLeft.seconds}</div>
            <div className="mt-2 text-sm md:text-base text-black/70">Segundos</div>
          </div>
        </div>
        <div className="mt-6 text-center text-black/70">
          <p>Estamos ansiosos para celebrar este momento especial com você!</p>
        </div>
      </div>
    </Section>
  );
}

function Presentes() {
  const [copied, setCopied] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const copyToClipboard = async (text: string, msg = "Chave Pix copiada!") => {
    if (!isClient) return;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setCopiedMsg(msg);
      setTimeout(() => setCopied(false), 2200);
    } catch (e) {
      console.error(e);
    }
  };

  const currency = (v: number) => v?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const buildPixMemo = (valor: number, ref: string) => {
    const base = `Casamento André & Marilene — Cota: ${ref}`;
    return `${base} — ${currency(valor)}`;
  };

  const pixKey = "andre.marilene@email.com"; // Substitua pela chave real
  const cotas = [
    { titulo: "1 noite aconchegante", valor: 250, descricao: "Ajude com a hospedagem", ref: "hospedagem" },
    { titulo: "Jantar romântico", valor: 180, descricao: "Um brinde ao amor!", ref: "jantar" },
    { titulo: "Passeio especial", valor: 120, descricao: "Momento inesquecível", ref: "passeio" },
    { titulo: "Transporte", valor: 80, descricao: "Para chegar aos destinos", ref: "transporte" },
  ];

  return (
    <Section id="presentes" title="Lista de Presentes" subtitle="Sua presença é o maior presente, mas se desejar contribuir com nossa Lua de Mel, ficaremos muito gratos!">
      <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-12">
        {/* Card Pix */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 shadow-lg border border-white/20">
          <h3 className="text-lg sm:text-xl font-semibold text-[#3d5a40] mb-3">Contribua via Pix</h3>
          <p className="text-sm text-[#b8860b] mb-2">Chave Pix</p>
          <p className="text-base font-medium text-[#3d5a40] break-all mb-4">{pixKey}</p>
          <button
            onClick={() => copyToClipboard(pixKey, "Chave Pix copiada! ✅")}
            className="w-full px-4 py-3 bg-[#3d5a40] text-white rounded-full font-medium hover:bg-[#2d4a30] transition-all duration-300 text-sm sm:text-base"
          >
            Copiar chave Pix
          </button>
        </div>

        {/* Card QR Code */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 shadow-lg border border-white/20 flex flex-col items-center">
          <h3 className="text-lg sm:text-xl font-semibold text-[#3d5a40] mb-3">QR Code Pix</h3>
          <p className="text-sm text-[#b8860b] text-center mb-4">Abra o app do seu banco e aponte para o QR</p>
          <div className="w-40 h-40 sm:w-48 sm:h-48 bg-gradient-to-br from-[#f8f6f3] to-[#f0ede8] border-2 border-[#b8860b]/20 rounded-xl flex items-center justify-center">
            <div className="text-center text-[#b8860b]/60">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              <p className="text-xs">QR Code Pix</p>
            </div>
          </div>
        </div>

        {/* Card Lista Externa */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 shadow-lg border border-white/20">
          <h3 className="text-lg sm:text-xl font-semibold text-[#3d5a40] mb-3">Lista de Presentes</h3>
          <p className="text-sm text-[#b8860b] mb-4">Prefere pagar com cartão? Acesse nossa lista online.</p>
          <a
            href="https://www.icasei.com.br/andre-marilene"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full px-4 py-3 bg-[#b8860b] text-white rounded-full font-medium hover:bg-[#a0750a] transition-all duration-300 text-center text-sm sm:text-base"
          >
            Ver lista completa 💝
          </a>
        </div>
      </div>

      {/* Cotas de presente */}
      <div className="mb-8">
        <h4 className="text-xl sm:text-2xl font-semibold text-[#3d5a40] text-center mb-6">Escolha uma cota (opcional)</h4>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {cotas.map((cota, idx) => (
            <div
              key={idx}
              className="bg-white/70 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-white/20 hover:bg-white/80 transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <div className="text-[#3d5a40] font-semibold text-sm sm:text-base">{cota.titulo}</div>
                  <div className="text-xs sm:text-sm text-[#b8860b] mt-1">{cota.descricao}</div>
                </div>
                <div className="text-base sm:text-lg font-bold text-[#3d5a40] whitespace-nowrap">{currency(cota.valor)}</div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => copyToClipboard(pixKey, "Chave Pix copiada! ✅")}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-[#3d5a40] text-white rounded-full hover:bg-[#2d4a30] transition-all duration-300"
                >
                  Copiar chave Pix
                </button>
                <button
                  onClick={() => copyToClipboard(buildPixMemo(cota.valor, cota.ref), "Descrição copiada! 📝")}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-[#3d5a40]/30 text-[#3d5a40] rounded-full hover:bg-[#3d5a40]/10 transition-all duration-300"
                >
                  Copiar descrição
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toast de cópia */}
      {copied && (
        <div className="fixed left-1/2 transform -translate-x-1/2 bottom-6 z-50 transition-opacity duration-300">
          <div className="rounded-full bg-[#3d5a40] text-white px-6 py-3 shadow-lg">
            {copiedMsg || "Copiado!"}
          </div>
        </div>
      )}

      {/* Rodapé da seção */}
      <div className="text-center text-sm text-[#b8860b]/80 mt-8">
        Sua contribuição é totalmente opcional. Obrigado pelo carinho! 💚
      </div>
    </Section>
  );
}

// Componente principal
export default function WeddingSiteClient() {
  return (
    <main className="min-h-screen">
      <Hero />
      <MusicPlayer />
      <Gallery />
      <Countdown />
      <RSVP />
      <Presentes />
      <Footer />
    </main>
  );
}