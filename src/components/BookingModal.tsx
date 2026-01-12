import React, { useState } from 'react';
import { Paperclip, Image as ImgIcon, Calendar } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  professional: any;
  mode: string;
  onClose: () => void;
  onBook?: (data: any) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, professional, mode, onClose, onBook }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [homeAddress, setHomeAddress] = useState('');

  if (!isOpen) return null;

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const arr = Array.from(fileList);
    setFiles(prev => [...prev, ...arr]);
    arr.forEach(f => {
      if (f.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => setPreviews(prev => [...prev, String(reader.result)]);
        reader.readAsDataURL(f);
      } else {
        setPreviews(prev => [...prev, '']);
      }
    });
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { professional, mode, date, time, notes, files, homeAddress };
    if (onBook) onBook(payload);
    alert(`Rendez-vous demandé pour ${professional?.name || professional?.clinicName} le ${date} à ${time}`);
    // optionally show a persistent notification in parent via onBook
    onClose();
  };

  return (
    <div className="modal-overlay">
      <form className="modal-card" onSubmit={submit}>
        <div className="modal-header">
          <h3>Prendre rendez-vous</h3>
          <button type="button" className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="prof-line">
            <img src={professional?.imageUrl || '/placeholder.png'} alt={professional?.name} className="card-avatar" />
            <div>
              <div className="font-semibold">{professional?.name || professional?.clinicName}</div>
              <div className="text-sm text-gray-500">{professional?.specialty} • {mode}</div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <label className="flex flex-col">
              <span className="text-sm text-gray-600">Date</span>
              <input required type="date" value={date} onChange={(e) => setDate(e.target.value)} className="px-3 py-2 border rounded-md" />
            </label>
            <label className="flex flex-col">
              <span className="text-sm text-gray-600">Heure</span>
              <input required type="time" value={time} onChange={(e) => setTime(e.target.value)} className="px-3 py-2 border rounded-md" />
            </label>
          </div>

          {mode === 'domicile' && (
            <label className="block mt-3">
              <span className="text-sm text-gray-600">Adresse de domicile</span>
              <input type="text" value={homeAddress} onChange={(e) => setHomeAddress(e.target.value)} className="w-full px-3 py-2 border rounded-md mt-1" placeholder="Entrez votre adresse complète" />
            </label>
          )}

          <label className="block mt-3">
            <span className="text-sm text-gray-600">Notes / Symptômes (optionnel)</span>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-3 py-2 border rounded-md mt-1" rows={3} />
          </label>

          <div className="mt-3">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Paperclip className="w-4 h-4" /> Joindre images / documents
            </div>
            <input type="file" multiple onChange={(e) => handleFiles(e.target.files)} className="mb-2" />

            <div className="file-previews grid grid-cols-3 gap-2">
              {previews.map((p, i) => (
                <div key={i} className="preview-card">
                  {p ? <img src={p} alt={`preview-${i}`} className="preview-img" /> : <div className="preview-doc"><ImgIcon className="w-6 h-6" /> <div className="text-xs">Fichier</div></div>}
                  <button type="button" className="remove-file" onClick={() => removeFile(i)}>Supprimer</button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button type="button" className="px-3 py-2 rounded-md bg-gray-200" onClick={onClose}>Annuler</button>
            <button type="submit" className="px-3 py-2 rounded-md bg-teal-500 text-white">Demander RDV</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BookingModal;
