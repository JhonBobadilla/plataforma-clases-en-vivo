import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Line, Text } from "react-konva";

const Whiteboard = () => {
  const [lines, setLines] = useState([]);
  const [texts, setTexts] = useState([]);
  const [mode, setMode] = useState("draw"); // "draw" o "text"
  const [isAddingText, setIsAddingText] = useState(false);
  const [newTextPos, setNewTextPos] = useState({ x: 8, y: 8 });
  const [inputValue, setInputValue] = useState("");
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);
  const isDrawing = useRef(false);
  const inputRef = useRef();

  useEffect(() => {
    // Cuando se monta o cambia el tamaño, ajusta el stage al tamaño del contenedor
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
      setNewTextPos({ x: pointer.x, y: pointer.y });
      setIsAddingText(true);
      setInputValue("");
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

  const handleInputBlur = () => {
    if (inputValue.trim() !== "") {
      setTexts([...texts, { x: newTextPos.x, y: newTextPos.y, text: inputValue }]);
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
      setTexts([...texts, { x: newTextPos.x, y: newTextPos.y, text: inputValue }]);
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
              x={t.x}
              y={t.y}
              text={t.text}
              fontSize={22}
              fontFamily="Arial"
              fill="#fff"
              draggable
              width={stageSize.width - 16}
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
            width: stageSize.width - 16,
            height: stageSize.height - 56,
            overflow: "auto",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
          }}
          placeholder=""
          autoFocus
          rows={5}
        />
      )}
    <div className="flex justify-between mb-2">
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



