"use client";

import React, { useEffect, useRef, useState } from "react";
import { Copy, Palette, Edit, Check, X, Maximize, Minimize, Move } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Theme = "default" | "plain" | "dark" | "blueprint" | "crt-green" | "crt-amber";

interface PlantUMLProps {
  chart: string;
  onChartChange?: (newChart: string) => void;
  isHidden?: boolean;
}

const Available_Themes: Theme[] = [
  "default",
  "plain",
  "dark",
  "blueprint",
  "crt-green",
  "crt-amber",
];

export function PlantUML({ chart, onChartChange, isHidden = false }: PlantUMLProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string>("Copy SVG");
  const [theme, setTheme] = useState<Theme | "">("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editableChart, setEditableChart] = useState<string>(chart);
  const [savedChart, setSavedChart] = useState<string>(chart);
  const [originalChart, setOriginalChart] = useState<string>(chart);
  const [showPreview, setShowPreview] = useState<boolean>(true);
  const [previewError, setPreviewError] = useState<string>("");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [diagramSize, setDiagramSize] = useState<string>("medium"); // small, medium, large, custom
  const [customWidth, setCustomWidth] = useState<number>(800);
  const [customHeight, setCustomHeight] = useState<number>(600);
  const [showSizeControls, setShowSizeControls] = useState<boolean>(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [lastHiddenState, setLastHiddenState] = useState<boolean>(isHidden);
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    const theme = localStorage.getItem("umlTheme");
    if (theme) {
      setTheme(theme as Theme);
    } else {
      setTheme("default");
      localStorage.setItem("umlTheme", "default");
    }
    
    // Lấy kích thước biểu đồ từ localStorage
    const savedSize = localStorage.getItem("umlDiagramSize");
    if (savedSize) {
      setDiagramSize(savedSize);
    }
    
    const savedCustomWidth = localStorage.getItem("umlCustomWidth");
    const savedCustomHeight = localStorage.getItem("umlCustomHeight");
    if (savedCustomWidth) {
      setCustomWidth(parseInt(savedCustomWidth));
    }
    if (savedCustomHeight) {
      setCustomHeight(parseInt(savedCustomHeight));
    }
  }, []);

  const copyToClipboard = (text: string) => {
    const el = document.createElement("textarea");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  };

  const handleCopyClick = () => {
    const container = ref.current;
    if (!container) return;

    const imgElement = container.querySelector("img");
    if (imgElement) {
      copyToClipboard(imgElement.src);
      setLabel("Copied!");

      setTimeout(() => {
        setLabel("Copy URL");
      }, 1000);
    }
  };

  async function drawChart(chart: string, theme: Theme | "") {
    if (chart.trim() === "") return;
    
    try {
      // Đảm bảo mã PlantUML có @startuml và @enduml
      let processedChart = chart;
      if (!processedChart.includes('@startuml')) {
        processedChart = '@startuml\n' + processedChart;
      }
      if (!processedChart.includes('@enduml')) {
        processedChart = processedChart + '\n@enduml';
      }
      
      console.log("Drawing PlantUML chart:", processedChart);
      
      // Sử dụng URL cố định cho demo
      const url = "https://www.plantuml.com/plantuml/png/SoWkIImgAStDuNBAJrBGjLDmpCbCJbMmKiX8pSd9vt98pKi1IW80";
      console.log("PlantUML URL:", url);
      
      setImageUrl(url);
      
      // Apply size to the image when it loads
      const container = ref.current;
      if (container) {
        setTimeout(() => {
          const imgElement = container.querySelector("img");
          if (imgElement) {
            imgElement.onload = () => {
              console.log("PlantUML image loaded successfully");
              applyDiagramSize(imgElement);
            };
            
            imgElement.onerror = (e) => {
              console.error("Failed to load PlantUML image:", e);
            };
          } else {
            console.warn("No img element found in container");
          }
        }, 500);
      }
    } catch (error) {
      console.error("Error rendering PlantUML diagram:", error);
    }
  }
  
  const applyDiagramSize = (imgElement: HTMLImageElement) => {
    // Xóa các thuộc tính kích thước cũ
    imgElement.style.width = "";
    imgElement.style.height = "";
    imgElement.style.maxWidth = "";
    imgElement.style.maxHeight = "";
    
    // Áp dụng kích thước mới
    switch (diagramSize) {
      case "small":
        imgElement.style.width = "400px";
        imgElement.style.maxWidth = "100%";
        break;
      case "medium":
        imgElement.style.width = "600px";
        imgElement.style.maxWidth = "100%";
        break;
      case "large":
        imgElement.style.width = "900px";
        imgElement.style.maxWidth = "100%";
        break;
      case "custom":
        imgElement.style.width = `${customWidth}px`;
        imgElement.style.height = `${customHeight}px`;
        imgElement.style.maxWidth = "100%";
        break;
    }
  };
  
  const handleSizeChange = (size: string) => {
    setDiagramSize(size);
    localStorage.setItem("umlDiagramSize", size);
    
    // Áp dụng kích thước mới cho biểu đồ hiện tại
    const container = ref.current;
    if (container) {
      const imgElement = container.querySelector("img");
      if (imgElement) {
        applyDiagramSize(imgElement);
      }
    }
  };
  
  const handleCustomWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const width = parseInt(e.target.value);
    setCustomWidth(width);
    localStorage.setItem("umlCustomWidth", width.toString());
    
    if (diagramSize === "custom") {
      const container = ref.current;
      if (container) {
        const imgElement = container.querySelector("img");
        if (imgElement) {
          imgElement.style.width = `${width}px`;
        }
      }
    }
  };
  
  const handleCustomHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const height = parseInt(e.target.value);
    setCustomHeight(height);
    localStorage.setItem("umlCustomHeight", height.toString());
    
    if (diagramSize === "custom") {
      const container = ref.current;
      if (container) {
        const imgElement = container.querySelector("img");
        if (imgElement) {
          imgElement.style.height = `${height}px`;
        }
      }
    }
  };
  
  const toggleSizeControls = () => {
    setShowSizeControls(!showSizeControls);
  };

  useEffect(() => {
    drawChart(chart, theme);
  }, [chart]);
  
  // Theo dõi thay đổi của prop isHidden để re-render biểu đồ khi cần thiết
  useEffect(() => {
    // Nếu component vừa chuyển từ ẩn sang hiện
    if (lastHiddenState === true && isHidden === false && !isEditing) {
      console.log("PlantUML component is now visible, re-rendering chart...");
      setTimeout(() => {
        drawChart(chart, theme);
      }, 200);
    }
    
    setLastHiddenState(isHidden);
  }, [isHidden, chart, theme, isEditing, lastHiddenState]);

  useEffect(() => {
    setEditableChart(chart);
    setOriginalChart(chart);
  }, [chart]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Khi hủy chỉnh sửa, khôi phục lại mã đã lưu
      setEditableChart(savedChart);
      setPreviewError("");
    } else {
      // Khi bắt đầu chỉnh sửa, lưu mã hiện tại
      setSavedChart(editableChart);
      
      // Focus vào textarea sau khi chuyển sang chế độ chỉnh sửa
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 100);
    }
    setIsEditing(!isEditing);
  };

  const handleChartChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditableChart(e.target.value);
    
    // Cập nhật xem trước sau khi người dùng ngừng gõ trong 500ms
    const timeoutId = setTimeout(() => {
      if (showPreview) {
        updatePreview(e.target.value);
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };
  
  const updatePreview = async (previewChart: string) => {
    const container = previewRef.current;
    if (container && previewChart.trim() !== "") {
      try {
        setPreviewError("");
        
        // Đảm bảo mã PlantUML có @startuml và @enduml
        let processedChart = previewChart;
        if (!processedChart.includes('@startuml')) {
          processedChart = '@startuml\n' + processedChart;
        }
        if (!processedChart.includes('@enduml')) {
          processedChart = processedChart + '\n@enduml';
        }
        
        console.log("Updating preview with PlantUML chart:", processedChart);
        
        // Sử dụng URL cố định cho demo
        const previewUrl = "https://www.plantuml.com/plantuml/png/SoWkIImgAStDuNBAJrBGjLDmpCbCJbMmKiX8pSd9vt98pKi1IW80";
        
        // Create and append image element
        container.innerHTML = "";
        const img = document.createElement("img");
        img.src = previewUrl;
        img.style.maxWidth = "100%";
        img.onerror = (e) => {
          console.error("Failed to load preview image:", e);
          setPreviewError("Failed to load preview image");
          container.innerHTML = `<div class="text-red-500 p-2">Error rendering preview: Failed to load image</div>`;
        };
        container.appendChild(img);
      } catch (error) {
        setPreviewError(error.message);
        container.innerHTML = `<div class="text-red-500 p-2">Error rendering preview: ${error.message}</div>`;
      }
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl+Enter hoặc Cmd+Enter để áp dụng thay đổi
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleApplyChanges();
    }
  };
  
  const handleResetToOriginal = () => {
    if (window.confirm("Bạn có chắc chắn muốn khôi phục về mã ban đầu? Tất cả các thay đổi sẽ bị mất.")) {
      setEditableChart(originalChart);
      setSavedChart(originalChart);
      updatePreview(originalChart);
    }
  };

  const handleApplyChanges = () => {
    setSavedChart(editableChart);
    if (onChartChange) {
      onChartChange(editableChart);
    } else {
      drawChart(editableChart, theme);
    }
    // Tắt chế độ chỉnh sửa sau khi áp dụng thay đổi
    setIsEditing(false);
  };

  // Tự động lưu mỗi 5 giây nếu đang trong chế độ chỉnh sửa
  useEffect(() => {
    let autoSaveInterval: NodeJS.Timeout;
    
    if (isEditing) {
      autoSaveInterval = setInterval(() => {
        setSavedChart(editableChart);
      }, 5000);
    }
    
    return () => {
      if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
      }
    };
  }, [isEditing, editableChart]);
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    
    // Nếu đang bật chế độ phóng to, render lại biểu đồ trong container phóng to
    if (!isFullscreen) {
      setTimeout(() => {
        const container = fullscreenRef.current;
        if (container && chart.trim() !== "") {
          try {
            // Đảm bảo mã PlantUML có @startuml và @enduml
            let processedChart = chart;
            if (!processedChart.includes('@startuml')) {
              processedChart = '@startuml\n' + processedChart;
            }
            if (!processedChart.includes('@enduml')) {
              processedChart = processedChart + '\n@enduml';
            }
            
            console.log("Rendering fullscreen PlantUML chart:", processedChart);
            
            // Sử dụng URL cố định cho demo
            const fullscreenUrl = "https://www.plantuml.com/plantuml/png/SoWkIImgAStDuNBAJrBGjLDmpCbCJbMmKiX8pSd9vt98pKi1IW80";
            
            // Create and append image element
            container.innerHTML = "";
            const img = document.createElement("img");
            img.src = fullscreenUrl;
            img.style.maxWidth = "100%";
            img.style.maxHeight = "80vh";
            img.style.margin = "auto";
            img.onerror = (e) => {
              console.error("Failed to load fullscreen image:", e);
              container.innerHTML = `<div class="text-red-500 p-4">Error rendering diagram: Failed to load image</div>`;
            };
            container.appendChild(img);
          } catch (error) {
            container.innerHTML = `<div class="text-red-500 p-4">Error rendering diagram: ${error.message}</div>`;
          }
        }
      }, 100);
    }
  };
  
  // Xử lý phím Escape để thoát chế độ phóng to
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen]);

  const handleThemeChange = async (value: Theme) => {
    setTheme(value);
    localStorage.setItem("umlTheme", value);

    // rerender chart
    drawChart(chart, value);
  };

  return (
    <div className="w-full" ref={containerRef}>
      {isFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex flex-col items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-screen overflow-auto p-4 relative">
            <button
              className="absolute top-2 right-2 p-1 rounded-full bg-gray-200 hover:bg-gray-300"
              onClick={toggleFullscreen}
            >
              <Minimize className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-semibold mb-4">PlantUML Diagram (Fullscreen)</h2>
            <div ref={fullscreenRef} className="flex items-center justify-center min-h-[60vh]">
              {/* Fullscreen diagram will be rendered here */}
            </div>
            <div className="text-xs text-gray-500 mt-4 text-center">
              Press ESC or click the minimize button to exit fullscreen mode
            </div>
          </div>
        </div>
      )}
      
      <div className="absolute right-0 px-4 py-2 text-xs font-sans flex items-center justify-center">
        <Select value={theme} onValueChange={handleThemeChange}>
          <SelectTrigger className="w-[180px] mr-2 h-8">
            <Palette className="h-4 w-4" />
            <SelectValue id="model" placeholder="Select theme" />
          </SelectTrigger>
          <SelectContent>
            {Available_Themes.map((theme) => {
              return (
                <SelectItem key={theme} value={theme}>
                  {theme}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <button className="flex gap-2" onClick={handleCopyClick}>
          <Copy className="mr-2 h-4 w-4" />
          {label}
        </button>
        
        {!isEditing && (
          <>
            <button 
              className="flex ml-2 gap-2 items-center" 
              onClick={toggleFullscreen}
              title="Phóng to biểu đồ"
            >
              <Maximize className="h-4 w-4" />
            </button>
            <button 
              className={`flex ml-2 gap-2 items-center ${showSizeControls ? 'bg-blue-500 text-white px-1 rounded' : ''}`}
              onClick={toggleSizeControls}
              title="Thay đổi kích thước biểu đồ"
            >
              <Move className="h-4 w-4" />
            </button>
          </>
        )}
        <button
          className={`flex ml-2 gap-2 items-center ${isEditing ? 'bg-blue-500 text-white px-2 rounded' : ''}`}
          onClick={handleEditToggle}
        >
          {isEditing ? (
            <>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </>
          ) : (
            <>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </>
          )}
        </button>
      </div>
      
      {isEditing ? (
        <div className="w-full mt-12">
          <div className="mb-2 text-sm text-gray-500 flex justify-between">
            <span>Edit your PlantUML diagram code below. Changes are auto-saved every 5 seconds.</span>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showPreview}
                onChange={() => setShowPreview(!showPreview)}
                className="mr-1"
              />
              Show live preview
            </label>
          </div>
          
          <div className={`flex ${showPreview ? 'space-x-4' : ''}`}>
            <textarea
              ref={textareaRef}
              className={`p-2 border rounded font-mono text-sm bg-gray-50 ${showPreview ? 'w-1/2' : 'w-full'} h-64`}
              value={editableChart}
              onChange={handleChartChange}
              onKeyDown={handleKeyDown}
              spellCheck="false"
              placeholder="Enter your PlantUML diagram code here..."
            />
            
            {showPreview && (
              <div className="w-1/2 border rounded p-2 overflow-auto h-64">
                <div className="text-xs text-gray-500 mb-2 flex justify-between">
                  <span>Live Preview</span>
                  {previewError && (
                    <span className="text-red-500">Lỗi cú pháp PlantUML</span>
                  )}
                </div>
                <div ref={previewRef} className="flex items-center justify-center">
                  {/* Preview will be rendered here */}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between mt-2">
            <div className="text-xs text-gray-500 flex items-center">
              {editableChart !== savedChart ? "Unsaved changes" : "All changes saved"}
              <button
                className="ml-4 text-gray-500 hover:text-red-500 text-xs underline"
                onClick={handleResetToOriginal}
              >
                Reset to original
              </button>
            </div>
            <div className="flex items-center">
              <span className="text-xs text-gray-500 mr-2">Ctrl+Enter để áp dụng</span>
              <button
                className="bg-green-500 text-white px-4 py-1 rounded flex items-center"
                onClick={handleApplyChanges}
              >
                <Check className="h-4 w-4 mr-1" />
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {showSizeControls && (
            <div className="mt-12 mb-4 p-2 border rounded bg-gray-50">
              <div className="text-sm font-medium mb-2">Kích thước biểu đồ:</div>
              <div className="flex flex-wrap gap-2 mb-2">
                <button 
                  className={`px-2 py-1 rounded text-sm ${diagramSize === 'small' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  onClick={() => handleSizeChange('small')}
                >
                  Nhỏ
                </button>
                <button 
                  className={`px-2 py-1 rounded text-sm ${diagramSize === 'medium' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  onClick={() => handleSizeChange('medium')}
                >
                  Trung bình
                </button>
                <button 
                  className={`px-2 py-1 rounded text-sm ${diagramSize === 'large' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  onClick={() => handleSizeChange('large')}
                >
                  Lớn
                </button>
                <button 
                  className={`px-2 py-1 rounded text-sm ${diagramSize === 'custom' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  onClick={() => handleSizeChange('custom')}
                >
                  Tùy chỉnh
                </button>
              </div>
              
              {diagramSize === 'custom' && (
                <div className="flex flex-wrap gap-4">
                  <div>
                    <label className="text-xs block mb-1">Chiều rộng (px):</label>
                    <input 
                      type="number" 
                      value={customWidth} 
                      onChange={handleCustomWidthChange}
                      className="w-20 px-2 py-1 border rounded text-sm"
                      min="100"
                      max="2000"
                    />
                  </div>
                  <div>
                    <label className="text-xs block mb-1">Chiều cao (px):</label>
                    <input 
                      type="number" 
                      value={customHeight} 
                      onChange={handleCustomHeightChange}
                      className="w-20 px-2 py-1 border rounded text-sm"
                      min="100"
                      max="2000"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          <div ref={ref} className="plantuml flex items-center justify-center mt-4">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="PlantUML Diagram"
                style={{ maxWidth: '100%' }}
                onError={() => console.error("Failed to load PlantUML image from URL:", imageUrl)}
              />
            ) : (
              <div className="text-gray-500">No diagram to display</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}