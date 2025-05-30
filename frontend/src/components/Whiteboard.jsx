import React, { useRef, useState } from "react";
import { Stage, Layer, Line, Text } from "react-konva";

const BOARD_WIDTH = 600;
const BOARD_HEIGHT = 400;
const MARGIN = 8;

const Whiteboard = () => {
  const [lines, setLines] = useState([]);
  const [texts, setTexts] = useState([]);
  const [mode, setMode] = useState("draw"); // "draw" o "text"
  const [isAddingText, setIsAddingText] = useState(false);
  const [newTextPos, setNewTextPos] = useState({ x: MARGIN, y: MARGIN });
  const [inputValue, setInputValue] = useState("");
  const isDrawing = useRef(false);
  const inputRef = useRef();

  // Dibujo libre
  const handleMouseDown = (e) => {
    if (mode !== "draw") return;
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current || mode !== "draw") return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    lastLine = {
      ...lastLine,
      points: lastLine.points.concat([point.x, point.y]),
    };
    const newLines = lines.slice(0, -1).concat(lastLine);
    setLines(newLines);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  // Limpiar tablero
  const handleClear = () => {
    setLines([]);
    setTexts([]);
    setIsAddingText(false);
    setInputValue("");
  };

  // Click para texto solo si modo texto y no ya escribiendo
  const handleStageClick = (e) => {
    if (mode !== "text" || isAddingText) return;
    if (e.target === e.target.getStage()) {
      setNewTextPos({ x: MARGIN, y: MARGIN });
      setIsAddingText(true);
      setInputValue(""); // Empezar nuevo texto vacío
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.selectionStart = 0;
          inputRef.current.selectionEnd = 0;
        }
      }, 0);
    }
  };

  const handleInputChange = (e) => setInputValue(e.target.value);

  // Guardar texto y cerrar textarea
  const handleInputBlur = () => {
    if (inputValue.trim() !== "") {
      // Guarda texto actual en lista
      setTexts([...texts, { x: newTextPos.x, y: newTextPos.y, text: inputValue }]);
    }
    setIsAddingText(false);
    setInputValue("");
  };

  // Enter = salto de línea, Ctrl+Enter o Esc = cerrar
  const handleInputKeyDown = (e) => {
    if (e.key === "Escape" || (e.key === "Enter" && e.ctrlKey)) {
      handleInputBlur();
    }
  };

  // Cambio de modo; si estaba editando texto lo guarda y cierra textarea
  const changeMode = (newMode) => {
    if (isAddingText && inputValue.trim() !== "") {
      setTexts([...texts, { x: newTextPos.x, y: newTextPos.y, text: inputValue }]);
      setIsAddingText(false);
      setInputValue("");
    }
    setMode(newMode);
  };

  return (
    <div className="flex flex-col items-center h-full w-full">
      <div className="flex justify-between w-full mb-2">
        <div className="flex gap-2">
          <button
            className={`px-4 py-1 font-bold rounded transition ${
              mode === "draw"
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-600 border border-blue-600"
            }`}
            onClick={() => changeMode("draw")}
            disabled={mode === "draw"}
          >
            Dibujar a mano alzada
          </button>
          <button
            className={`px-4 py-1 font-bold rounded transition ${
              mode === "text"
                ? "bg-green-600 text-white"
                : "bg-white text-green-600 border border-green-600"
            }`}
            onClick={() => changeMode("text")}
            disabled={mode === "text"}
          >
            Escribir con teclado
          </button>
        </div>
        <button
          className="bg-red-500 text-white rounded px-4 py-1 font-bold hover:bg-red-700 transition ml-4"
          onClick={handleClear}
        >
          Limpiar tablero
        </button>
      </div>
      <div
        style={{
          position: "relative",
          width: BOARD_WIDTH,
          height: BOARD_HEIGHT,
          background: "#111",
        }}
      >
        <Stage
          width={BOARD_WIDTH}
          height={BOARD_HEIGHT}
          className="shadow-md rounded-lg border"
          style={{
            border: "2px solid #333",
            background: "#000",
          }}
          onClick={handleStageClick}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
        >
          <Layer>
            {/* Rectángulo fondo negro para asegurar el fill */}
            <rect width={BOARD_WIDTH} height={BOARD_HEIGHT} fill="#000" />
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke="#fff"
                strokeWidth={3}
                tension={0.5}
                lineCap="round"
                globalCompositeOperation="source-over"
              />
            ))}
            {texts.map((t, i) => (
              <Text
                key={i}
                x={t.x}
                y={t.y}
                text={t.text}
                fontSize={22}
                fontFamily="Arial"
                fill="#fff"
                draggable
                width={BOARD_WIDTH - MARGIN * 2} // Para que haga wrap y no se salga
              />
            ))}
          </Layer>
        </Stage>
        {mode === "text" && isAddingText && (
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            style={{
              position: "absolute",
              top: newTextPos.y - 8,
              left: newTextPos.x - 4,
              fontSize: 22,
              border: "none",
              borderRadius: 0,
              padding: 4,
              outline: "none",
              color: "#fff",
              background: "transparent",
              zIndex: 10,
              resize: "none",
              width: BOARD_WIDTH - MARGIN * 2,
              height: BOARD_HEIGHT - MARGIN * 2,
              overflow: "auto",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
            placeholder=""
            autoFocus
            rows={5}
          />
        )}
      </div>
      <div className="mt-2 text-xs text-gray-400">
        {mode === "draw"
          ? "Modo dibujo: mantén presionado el mouse para dibujar líneas blancas."
          : "Modo texto: haz clic en el tablero para escribir texto blanco. Usa Ctrl+Enter o Esc para terminar."}
      </div>
    </div>
  );
};

export default Whiteboard;
