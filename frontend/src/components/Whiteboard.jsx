import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Line, Text } from "react-konva";

const MARGIN_LEFT = 20;
const MARGIN_RIGHT = 40;

const Whiteboard = () => {
  const [lines, setLines] = useState([]);
  const [texts, setTexts] = useState([]);
  const [mode, setMode] = useState("draw"); // "draw" o "text"
  const [isAddingText, setIsAddingText] = useState(false);
  const [newTextPos, setNewTextPos] = useState({ x: MARGIN_LEFT, y: 8 });
  const [inputValue, setInputValue] = useState("");
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);
  const isDrawing = useRef(false);
  const inputRef = useRef();

  // Ajustar tamaño dinámico al contenedor (100%)
  useEffect(() => {
    function updateSize() {
      if (containerRef.current) {
        setStageSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

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

  const handleClear = () => {
    setLines([]);
    setTexts([]);
    setIsAddingText(false);
    setInputValue("");
  };

  const handleStageClick = (e) => {
    if (mode !== "text" || isAddingText) return;
    if (e.target === e.target.getStage()) {
      const pointer = e.target.getStage().getPointerPosition();
      setNewTextPos({ x: MARGIN_LEFT, y: pointer.y });
      setIsAddingText(true);
      setInputValue("");
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.selectionStart = 0;
          inputRef.current.selectionEnd = 0;
          inputRef.current.style.height = "auto";
          inputRef.current.style.height = inputRef.current.scrollHeight + "px";
        }
      }, 0);
    }
  };

  // --- Cálculo de límites para textarea ---
  const textareaWidth = Math.max(
    100,
    stageSize.width - MARGIN_LEFT - MARGIN_RIGHT
  );

  const bottomPadding = 48 + 8; // zona de botones + margen
  // Espacio máximo hacia abajo desde donde clicaste
  const espacioDisponible = Math.max(
    38, // minHeight
    stageSize.height - newTextPos.y - bottomPadding
  );
  // Si das clic tan abajo que no cabe el textarea, súbelo más arriba para que sí haya espacio para escribir
  const textareaTop = Math.min(
    newTextPos.y,
    stageSize.height - bottomPadding - 100 // deja siempre al menos 100px para varias líneas
  );
  const textareaHeight = Math.min(300, espacioDisponible);

  const limitedTextPos = {
    x: MARGIN_LEFT,
    y: textareaTop,
  };

  // --- Altura dinámica del textarea al escribir ---
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      // Crece hasta el máximo permitido, y nunca muestra scroll interno
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, textareaHeight) + "px";
    }
  };

  const handleInputBlur = () => {
    if (inputValue.trim() !== "") {
      setTexts([
        ...texts,
        { x: MARGIN_LEFT, y: limitedTextPos.y, text: inputValue }, // x: MARGIN_LEFT SIEMPRE
      ]);
    }
    setIsAddingText(false);
    setInputValue("");
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Escape" || (e.key === "Enter" && e.ctrlKey)) {
      handleInputBlur();
    }
  };

  const changeMode = (newMode) => {
    if (isAddingText && inputValue.trim() !== "") {
      setTexts([
        ...texts,
        { x: MARGIN_LEFT, y: limitedTextPos.y, text: inputValue },
      ]);
      setIsAddingText(false);
      setInputValue("");
    }
    setMode(newMode);
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col w-full h-full bg-black p-2 rounded-lg"
      style={{ position: "relative", height: "100%" }}
    >
      <Stage
        width={stageSize.width}
        height={stageSize.height - 48}
        className="rounded-md"
        style={{
          border: "2px solid rgb(72, 70, 70)",
          background: "#000",
          flexGrow: 1,
        }}
        onClick={handleStageClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      >
        <Layer>
          <rect width={stageSize.width} height={stageSize.height - 48} fill="#000" />
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
              x={MARGIN_LEFT}
              y={t.y}
              text={t.text}
              fontSize={22}
              fontFamily="Arial"
              fill="#fff"
              draggable
              width={textareaWidth}
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
            top: limitedTextPos.y,
            left: MARGIN_LEFT,
            fontSize: 22,
            border: "none",
            borderRadius: 0,
            padding: 4,
            outline: "none",
            color: "#fff",
            background: "transparent",
            zIndex: 10,
            resize: "none",
            width: textareaWidth,
            minHeight: 38,
            maxHeight: textareaHeight,
            overflow: "hidden", // Nunca scroll interno
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
            maxWidth: textareaWidth,
          }}
          placeholder=""
          autoFocus
          rows={1}
        />
      )}
      <div className="flex justify-between mb-2 mt-1">
        <div className="flex gap-2">
          <button
            className={`px-4 py-1 font-bold rounded transition ${
              mode === "draw"
                ? "bg-white text-black"
                : "bg-white text-black border border-none"
            }`}
            onClick={() => changeMode("draw")}
            disabled={mode === "draw"}
          >
            Dibujar
          </button>
          <button
            className={`px-4 py-1 font-bold rounded transition ${
              mode === "text"
                ? "bg-white text-black"
                : "bg-white text-black border border-none"
            }`}
            onClick={() => changeMode("text")}
            disabled={mode === "text"}
          >
            Escribir
          </button>
        </div>
        <button
          className="bg-white text-black rounded px-4 py-1 font-bold hover:bg-gray-400 transition ml-4"
          onClick={handleClear}
        >
          Limpiar
        </button>
      </div>
    </div>
  );
};

export default Whiteboard;


