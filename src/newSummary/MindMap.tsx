import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { MindMapNode } from './types';
import { ZoomIn, ZoomOut, Hand, Download, Move, RotateCw, Plus, Minus, Maximize2, Minimize2 } from 'lucide-react';

interface MindMapProps {
  data: MindMapNode;
}

const MindMap: React.FC<MindMapProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [currentZoom, setCurrentZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [initialTransform, setInitialTransform] = useState<d3.ZoomTransform | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previousDimensions, setPreviousDimensions] = useState<{ width: number; height: number } | null>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown>>();
  const [collapsedNodes, setCollapsedNodes] = useState(new Set<string>());
  const [showTextHighlight, setShowTextHighlight] = useState(true);
  const [showColoredLines, setShowColoredLines] = useState(true);
  const resizeTimeoutRef = useRef<number | null>(null);

  const updateDimensions = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      
      // If not in fullscreen, ensure we maintain a minimum height
      const height = isFullscreen ? window.innerHeight : Math.max(800, rect.height);
      
      setDimensions({
        width: rect.width,
        height: height
      });
    }
  };

  useEffect(() => {
    updateDimensions();

    const handleResize = () => {
      // Clear any existing timeout
      if (resizeTimeoutRef.current) {
        window.clearTimeout(resizeTimeoutRef.current);
      }

      // Set a new timeout to update dimensions
      resizeTimeoutRef.current = window.setTimeout(() => {
        updateDimensions();
      }, 250); // Debounce resize events
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutRef.current) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [isFullscreen]);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = document.fullscreenElement === containerRef.current;
      
      if (isNowFullscreen && !isFullscreen) {
        // Store current dimensions before going fullscreen
        setPreviousDimensions(dimensions);
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      } else if (!isNowFullscreen && isFullscreen) {
        // Restore previous dimensions when exiting fullscreen
        if (previousDimensions) {
          setDimensions(previousDimensions);
          // Reset the transform to initial state
          if (svgRef.current && zoomBehaviorRef.current && initialTransform) {
            const svg = d3.select(svgRef.current);
            svg.transition()
              .duration(300)
              .call(zoomBehaviorRef.current.transform, initialTransform);
          }
        }
      }
      
      setIsFullscreen(isNowFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [isFullscreen, previousDimensions, dimensions, initialTransform]);

  const toggleFullscreen = async () => {
    try {
      if (!isFullscreen) {
        await containerRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  const handleZoom = (factor: number) => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;

    const svg = d3.select(svgRef.current);
    const currentTransform = d3.zoomTransform(svg.node()!);
    
    const newZoom = Math.min(Math.max(currentTransform.k * factor, 0.1), 2);
    
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    
    const newTransform = d3.zoomIdentity
      .translate(currentTransform.x, currentTransform.y)
      .scale(newZoom);

    svg.transition()
      .duration(300)
      .call(zoomBehaviorRef.current.transform, newTransform);

    setCurrentZoom(newZoom);
  };

  const togglePanning = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;

    setIsPanning(!isPanning);
    const svg = d3.select(svgRef.current);

    if (!isPanning) {
      zoomBehaviorRef.current.filter(() => true);
      svg.style('cursor', 'grab')
        .on('mousedown.cursor', () => svg.style('cursor', 'grabbing'))
        .on('mouseup.cursor', () => svg.style('cursor', 'grab'));
    } else {
      zoomBehaviorRef.current.filter(() => false);
      svg.style('cursor', 'default')
        .on('mousedown.cursor', null)
        .on('mouseup.cursor', null);
    }
  };

  const resetView = () => {
    if (!svgRef.current || !zoomBehaviorRef.current || !initialTransform) return;

    const svg = d3.select(svgRef.current);
    svg.transition()
      .duration(750)
      .call(zoomBehaviorRef.current.transform, initialTransform);
    
    setCurrentZoom(initialTransform.k);
  };

  const downloadMindMap = () => {
    if (!svgRef.current) return;

    // Get the current SVG and its dimensions
    const svg = svgRef.current;
    const bbox = svg.getBBox();
    
    // Create a canvas with 4K resolution
    const canvas = document.createElement('canvas');
    canvas.width = 3840; // 4K width
    canvas.height = 2160; // 4K height

    // Get the current transform
    const transform = d3.zoomTransform(svg);
    
    // Create a temporary SVG string with the current view state
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const URL = window.URL || window.webkitURL || window;
    const svgUrl = URL.createObjectURL(svgBlob);

    // Create an image to load the SVG
    const img = new Image();
    img.onload = () => {
      const ctx = canvas.getContext('2d')!;
      
      // Set white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate scaling to fit the content while maintaining aspect ratio
      const scale = Math.min(
        canvas.width / bbox.width,
        canvas.height / bbox.height
      ) * 0.9; // 90% of available space to add padding

      // Calculate position to center the content
      const x = (canvas.width - bbox.width * scale) / 2 - bbox.x * scale;
      const y = (canvas.height - bbox.height * scale) / 2 - bbox.y * scale;

      // Apply the current transform and draw
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      ctx.restore();

      // Convert to PNG and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'mindmap.png';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
    };

    img.src = svgUrl;
  };

  const toggleNode = (nodeId: string) => {
    setCollapsedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    if (!svgRef.current || !data || dimensions.width === 0) return;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const g = svg.append('g');

    const root = d3.hierarchy(data);

    // Filter visible nodes based on collapsed state
    const visibleNodes = root.descendants().filter(node => {
      let parent = node.parent;
      while (parent) {
        if (collapsedNodes.has(parent.data.id)) {
          return false;
        }
        parent = parent.parent;
      }
      return true;
    });

    const visibleLinks = root.links().filter(link => {
      return visibleNodes.includes(link.source) && visibleNodes.includes(link.target);
    });

    const maxDepth = d3.max(visibleNodes, d => d.depth) || 0;
    
    const availableHeight = dimensions.height - 100;
    const nodesPerLevel = Array(maxDepth + 1).fill(0);
    visibleNodes.forEach(d => nodesPerLevel[d.depth]++);
    const maxNodesInLevel = Math.max(...nodesPerLevel);
    
    const verticalSpacing = Math.max(
      Math.min(availableHeight / (maxNodesInLevel + 1), 250),
      150
    );

    const treeLayout = d3.tree<MindMapNode>()
      .nodeSize([verticalSpacing, dimensions.width / 3]);

    treeLayout(root);

    root.children?.forEach((node, index) => {
      node.y = index % 2 === 0 ? node.y : -node.y;
      node.y *= 2;
    });

    root.each(d => {
      if (d.depth === maxDepth) {
        d.y *= 1.25;
      } else if (d.depth === maxDepth - 1) {
        d.y *= 1.6;
      }
    });

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    visibleNodes.forEach(d => {
      minX = Math.min(minX, d.x);
      maxX = Math.max(maxX, d.x);
      minY = Math.min(minY, d.y);
      maxY = Math.max(maxY, d.y);
    });

    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;
    const scale = Math.min(
      (dimensions.width - 50) / contentHeight,
      (dimensions.height - 50) / contentWidth,
      2
    );

    const translateX = dimensions.width / 2;
    const translateY = dimensions.height / 2;

    g.attr('transform', `translate(${translateX},${translateY}) scale(${scale})`);

    // Define branch colors for first-level nodes
    const branchColors = [
      '#3B82F6', // Blue
      '#22C55E', // Green
      '#EF4444', // Red
      '#A855F7', // Purple
      '#F59E0B', // Orange
      '#EC4899', // Pink
      '#14B8A6', // Teal
      '#6366F1'  // Indigo
    ];

    // Create a color map for each first-level branch
    const colorMap = new Map();
    if (root.children) {
      root.children.forEach((child, index) => {
        colorMap.set(child, branchColors[index % branchColors.length]);
      });
    }

    // Function to get the color for a node based on its first-level ancestor
    const getNodeBranchColor = (node: d3.HierarchyNode<MindMapNode>) => {
      if (node.depth === 0) return '#64748B'; // Root node color
      if (node.depth === 1) return colorMap.get(node);
      let ancestor = node.parent;
      while (ancestor && ancestor.depth > 1) {
        ancestor = ancestor.parent;
      }
      return colorMap.get(ancestor) || '#64748B';
    };

    const getNodeColor = (depth: number) => {
      switch (depth) {
        case 0:
          return {
            bg: '#EFF6FF',
            text: '#1E40AF',
            circle: '#3B82F6'
          };
        case 1:
          return {
            bg: '#FEF2F2',
            text: '#991B1B',
            circle: '#EF4444'
          };
        case 2:
          return {
            bg: '#F0FDF4',
            text: '#166534',
            circle: '#22C55E'
          };
        case 3:
          return {
            bg: '#FDF4FF',
            text: '#86198F',
            circle: '#D946EF'
          };
        default:
          return {
            bg: '#FFF7ED',
            text: '#9A3412',
            circle: '#F97316'
          };
      }
    };

    // Add links with smooth transitions
    const links = g.append('g')
      .attr('class', 'links')
      .selectAll('path')
      .data(visibleLinks)
      .enter()
      .append('path')
      .attr('d', d3.linkHorizontal<any, any>()
        .x(d => {
          if (d.depth === maxDepth) {
            return d.y * 3;
          } else if (d.depth === maxDepth - 1) {
            return d.y * 2;
          }
          return d.y;
        })
        .y(d => d.x)
      )
      .attr('fill', 'none')
      .attr('stroke', d => showColoredLines ? getNodeBranchColor(d.target) : '#64748B')
      .attr('stroke-width', 4)
      .attr('opacity', 0)
      .transition()
      .duration(800)
      .attr('opacity', 1);

    // Add nodes with smooth transitions
    const nodes = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(visibleNodes)
      .enter()
      .append('g')
      .attr("transform", d => {
        let adjustedY = d.y;
        if (d.depth === maxDepth) {
          adjustedY *= 3;
        } else if (d.depth === maxDepth - 1) {
          adjustedY *= 2;
        }
        return `translate(${adjustedY},${d.x})`;
      });

    // Add node backgrounds
    nodes.append('rect')
      .attr('rx', 10)
      .attr('ry', 10)
      .attr('fill', d => showTextHighlight ? getNodeColor(d.depth).bg : 'white')
      .attr('opacity', 0)
      .attr('x', -80)
      .attr('y', -30)
      .attr('width', 160)
      .attr('height', 60);

    // Add node content with expand/collapse buttons
    nodes.each(function(d) {
      const node = d3.select(this);
      const hasChildren = d.children || d._children;
      const nodeColors = getNodeColor(d.depth);

      // Add text
      const text = node.append('text')
        .attr('dy', '0.35em')
        .attr('text-anchor', 'middle')
        .attr('fill', d.data.color || nodeColors.text)
        .style('font-size', d.depth === 0 ? '100px' : '80px')
        .style('font-weight', d.depth === 0 ? '700' : '500')
        .text(d.data.label)
        .style('opacity', 0);

      const bbox = (text.node() as SVGTextElement).getBBox();
      const padding = 20;

      // Update rectangle dimensions
      node.select('rect')
        .attr('x', bbox.x - padding / 2)
        .attr('y', bbox.y - padding / 2)
        .attr('width', bbox.width + padding)
        .attr('height', bbox.height + padding);

      // Add expand/collapse button if node has children
      if (hasChildren) {
        const buttonGroup = node.append('g')
          .attr('class', 'toggle-button')
          .attr('transform', `translate(${bbox.x + bbox.width + padding/2 + 10},0)`)
          .style('cursor', 'pointer')
          .on('click', (event) => {
            event.stopPropagation();
            toggleNode(d.data.id);
          });

        // Button background
        buttonGroup.append('circle')
          .attr('r', 18)
          .attr('fill', nodeColors.bg)
          .attr('stroke', nodeColors.circle)
          .attr('stroke-width', 2)
          .attr('opacity', 0.9);

        // Button icon (plus or minus)
        const isCollapsed = collapsedNodes.has(d.data.id);
        buttonGroup.append('text')
          .attr('dy', '0.35em')
          .attr('text-anchor', 'middle')
          .attr('fill', nodeColors.circle)
          .style('font-size', '24px')
          .text(isCollapsed ? '➕' : '➖');
      }

      // Fade in elements
      node.selectAll('*')
        .transition()
        .duration(800)
        .style('opacity', 1);
    });

    // Set up zoom behavior with updated scale extent
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 2])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        setCurrentZoom(event.transform.k);
      });

    zoomBehaviorRef.current = zoom;

    zoom.filter(() => false);
    svg.call(zoom);

    // Initial view positioning
    const bounds = g.node()?.getBBox();
    if (bounds) {
      const fullWidth = dimensions.width;
      const fullHeight = dimensions.height;
      const width = bounds.width;
      const height = bounds.height;
      const midX = bounds.x + width / 2;
      const midY = bounds.y + height / 2;

      const initialScale = Math.min(
        0.95 * fullWidth / width,
        0.95 * fullHeight / height,
        1.5
      );

      const transform = d3.zoomIdentity
        .translate(fullWidth / 2, fullHeight / 2)
        .scale(initialScale)
        .translate(-midX, -midY);

      setInitialTransform(transform);

      svg.transition()
        .duration(750)
        .call(zoom.transform, transform);
    }
  }, [data, dimensions, collapsedNodes, showTextHighlight, showColoredLines]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-[800px] bg-gray-50 rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 h-screen rounded-none border-0' : ''
      }`}
      style={{ minHeight: '800px' }}
    >
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <button
          onClick={toggleFullscreen}
          className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? (
            <Minimize2 className="w-5 h-5 text-gray-600" />
          ) : (
            <Maximize2 className="w-5 h-5 text-gray-600" />
          )}
        </button>
        <button
          onClick={() => handleZoom(1.2)}
          disabled={currentZoom >= 2}
          className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={() => handleZoom(0.8)}
          disabled={currentZoom <= 0.1}
          className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={togglePanning}
          className={`p-2 rounded-lg shadow-sm border transition-colors ${
            isPanning 
              ? 'bg-blue-100 border-blue-300 text-blue-600' 
              : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600'
          }`}
          title="Pan Tool"
        >
          {isPanning ? <Hand className="w-5 h-5" /> : <Move className="w-5 h-5" />}
        </button>
        <button
          onClick={resetView}
          className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
          title="Reset View"
        >
          <RotateCw className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={downloadMindMap}
          className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
          title="Download PNG"
        >
          <Download className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Style Controls */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-sm border border-gray-200 p-3 z-10">
        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showTextHighlight}
              onChange={(e) => setShowTextHighlight(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600"
            />
            <span className="text-sm text-gray-700">Text Highlighting</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showColoredLines}
              onChange={(e) => setShowColoredLines(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600"
            />
            <span className="text-sm text-gray-700">Colored Lines</span>
          </label>
        </div>
      </div>
      
      <div className="w-full h-full p-4">
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          className="overflow-hidden"
        />
      </div>
    </div>
  );
};

export default MindMap;