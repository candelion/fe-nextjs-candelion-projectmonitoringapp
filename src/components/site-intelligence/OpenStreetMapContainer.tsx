'use client'

import React, { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'
import { SitePointItem, PolygonZoneItem } from '@/types'

interface OpenStreetMapContainerProps {
  sitePoints: SitePointItem[]
  polygonZones?: PolygonZoneItem[]
  selectedPointId: string | null
  onSelectPoint: (point: SitePointItem) => void
  mapLayer: 'osm' | 'satellite'
}

export default function OpenStreetMapContainer({
  sitePoints,
  polygonZones = [],
  selectedPointId,
  onSelectPoint,
  mapLayer,
}: OpenStreetMapContainerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<{ [key: string]: any }>({})
  const tileLayerRef = useRef<any>(null)
  const polygonsRef = useRef<any[]>([])

  const telocorCenter: [number, number] = [-7.552697, 112.845201]

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return

    let isMounted = true

    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current || mapInstanceRef.current) return

      // Create map centered on Telocor Sidoarjo
      const map = L.map(mapContainerRef.current, {
        center: telocorCenter,
        zoom: 16,
        zoomControl: false,
        attributionControl: true,
      })

      mapInstanceRef.current = map

      // Tile Layer: OpenStreetMap or Satellite
      const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      const satelliteUrl =
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'

      const tileLayer = L.tileLayer(mapLayer === 'satellite' ? satelliteUrl : osmUrl, {
        maxZoom: 19,
        attribution:
          mapLayer === 'satellite'
            ? 'Tiles &copy; Esri &mdash; Telocor Sidoarjo'
            : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map)

      tileLayerRef.current = tileLayer

      // ─── Add Markers for Site Points ──────────────────────────────────────
      sitePoints.forEach((point) => {
        const isDone = point.status === 'completed'
        const bg = isDone ? '#10b981' : '#f59e0b'

        const customIcon = L.divIcon({
          className: 'custom-osm-pin',
          html: `
            <div style="
              display: flex;
              align-items: center;
              gap: 4px;
              background-color: ${bg};
              color: white;
              padding: 4px 8px;
              border-radius: 9999px;
              font-size: 11px;
              font-weight: bold;
              box-shadow: 0 4px 12px rgba(0,0,0,0.35);
              border: 2px solid white;
              white-space: nowrap;
              cursor: pointer;
              transform: translate(-50%, -50%);
            ">
              <span>📍</span>
              <span>${point.code}</span>
            </div>
          `,
          iconSize: [50, 24],
          iconAnchor: [25, 12],
        })

        const marker = L.marker([point.coordinates.lat, point.coordinates.lng], {
          icon: customIcon,
        }).addTo(map)

        marker.on('click', () => {
          onSelectPoint(point)
        })

        marker.bindTooltip(
          `<div style="font-weight: bold; font-size: 11px;">${point.code}: ${point.title}</div><div style="font-size: 10px; color: #64748b;">${point.targetDesc}</div><div style="font-size: 9px; color: #0284c7; margin-top: 2px;">PIC: ${point.assignedPic}</div>`,
          { direction: 'top', offset: [0, -10] }
        )

        markersRef.current[point.id] = marker
      })
    })

    return () => {
      isMounted = false
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Draw & Redraw Polygon Zones when polygonZones changes
  useEffect(() => {
    if (!mapInstanceRef.current) return

    import('leaflet').then((L) => {
      if (!mapInstanceRef.current) return

      // Clear existing polygons
      polygonsRef.current.forEach((p) => {
        mapInstanceRef.current.removeLayer(p)
      })
      polygonsRef.current = []

      // Draw all polygon zones
      polygonZones.forEach((poly) => {
        const polygon = L.polygon(poly.coordinates, {
          color: poly.color,
          weight: 2.5,
          opacity: 0.9,
          fillColor: poly.fillColor || poly.color,
          fillOpacity: poly.fillOpacity || 0.25,
          dashArray: '6, 6',
        }).addTo(mapInstanceRef.current)

        polygon.bindPopup(`
          <div style="font-family: inherit; font-size: 12px; padding: 6px; min-width: 200px;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 4px;">
              <span style="font-weight: 900; color: ${poly.color}; font-size: 12px; text-transform: uppercase;">${poly.code}</span>
              <span style="font-weight: bold; font-size: 10px; background: #f1f5f9; padding: 2px 6px; border-radius: 6px;">Progres: ${poly.progress}%</span>
            </div>
            <strong style="color: #0f172a; display: block; font-size: 12px; line-height: 1.3;">${poly.name}</strong>
            <p style="margin: 4px 0; color: #475569; font-size: 11px;">${poly.summary}</p>
            <div style="margin-top: 6px; padding-top: 4px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #334155;">
              <div><strong>PIC:</strong> ${poly.assignedPic || 'Hendra Wijaya, S.T.'}</div>
              <div><strong>Auditor:</strong> ${poly.assignedAuditor || 'Budi Santoso, S.E.'}</div>
            </div>
          </div>
        `)

        polygonsRef.current.push(polygon)
      })
    })
  }, [polygonZones])

  // Switch Layer (OSM vs Satellite)
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return

    import('leaflet').then((L) => {
      const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      const satelliteUrl =
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'

      mapInstanceRef.current.removeLayer(tileLayerRef.current)

      const newTileLayer = L.tileLayer(mapLayer === 'satellite' ? satelliteUrl : osmUrl, {
        maxZoom: 19,
        attribution:
          mapLayer === 'satellite'
            ? 'Tiles &copy; Esri &mdash; Telocor Sidoarjo'
            : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current)

      tileLayerRef.current = newTileLayer
    })
  }, [mapLayer])

  // Center on selected point
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedPointId) return

    const point = sitePoints.find((p) => p.id === selectedPointId)
    if (point) {
      mapInstanceRef.current.panTo([point.coordinates.lat, point.coordinates.lng], {
        animate: true,
        duration: 1,
      })

      const marker = markersRef.current[point.id]
      if (marker) {
        marker.openTooltip()
      }
    }
  }, [selectedPointId, sitePoints])

  return (
    <div className="relative w-full h-[520px] sm:h-[600px] rounded-2xl overflow-hidden shadow-inner border border-slate-800">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  )
}
