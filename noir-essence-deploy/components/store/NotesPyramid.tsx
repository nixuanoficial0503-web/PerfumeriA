interface NotesPyramidProps {
  notesTop: string[]
  notesHeart: string[]
  notesBase: string[]
}

export function NotesPyramid({ notesTop, notesHeart, notesBase }: NotesPyramidProps) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[9px] tracking-[0.2em] uppercase text-muted">Pirámide olfativa</p>
      <div className="grid grid-cols-3 gap-4">
        <NoteGroup title="Salida" notes={notesTop} />
        <NoteGroup title="Corazón" notes={notesHeart} />
        <NoteGroup title="Fondo" notes={notesBase} />
      </div>
    </div>
  )
}

function NoteGroup({ title, notes }: { title: string; notes: string[] }) {
  if (!notes.length) return null
  return (
    <div>
      <p className="text-[8px] tracking-[0.15em] uppercase text-gold mb-2">{title}</p>
      <div className="flex flex-wrap gap-1">
        {notes.map(note => (
          <span
            key={note}
            className="inline-block px-2 py-0.5 border border-[rgba(184,154,90,0.2)] text-[9px] text-muted"
          >
            {note}
          </span>
        ))}
      </div>
    </div>
  )
}
