'use client'

import React, { useEffect, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import { SitePointItem } from '@/types'

// Telocor Sidoarjo Polygon definitions
export const TELOCOR_POLYGONS = [
  {
    code: 'ZONA A',
    name: 'Zona A — Dermaga Utama Telocor',
    color: '#10b981', // Emerald
    fillColor: '#10b981',
    fillOpacity: 0.25,
    coordinates: [
      [-7.5518, 112.8442],
      [-7.5518, 112.8464],
      [-7.5532, 112.8466],
      [-7.5535, 112.8445],
    ] as [number, number][],
    summary: 'Struktur pondasi cerucuk & tiang pancang dermaga Telocor Sidoarjo',
  },
  {
    code: 'ZONA B',
    name: 'Zona B — Jetty Wisata & Kali Porong',
    color: '#6366f1', // Indigo
    fillColor: '#6366f1',
    fillOpacity: 0.25,
    coordinates: [
      [-7.5530, 112.8448],
      [-7.5532, 112.8475],
      [-7.5546, 112.8482],
      [-7.5548, 112.8452],
    ] as [number, number][],
    summary: 'Konstruksi balok, kolom & plat lantai dermaga apung Telocor',
  },
  {
    code: 'ZONA C',
    name: 'Zona C — Tanggul Breakwater Muara',
    color: '#06b6d4', // Cyan
    fillColor: '#06b6d4',
    fillOpacity: 0.25,
    coordinates: [
      [-7.5542, 112.8430],
      [-7.5544, 112.8455],
      [-7.5562, 112.8462],
      [-7.5560, 112.8432],
    ] as [number, number][],
    summary: 'Pengaman abrasi pesisir & tanggul penahan sedimen muara Porong',
  },
  {
    code: 'ZONA D',
    name: 'Zona D — Area Fabrikasi & Akses Telocor',
    color: '#8b5cf6', // Purple
    fillColor: '#8b5cf6',
    fillOpacity: 0.25,
    coordinates: [
      [-7.5505, 112.8415],
      [-7.5510, 112.8440],
      [-7.5525, 112.8438],
      [-7.5522, 112.8412],
    ] as [number, number][],
    summary: 'Workshop fabrikasi tulangan baja & gudang logistik darat Telocor',
  },
]

interface OpenStreetMapContainerProps {
  sitePoints: SitePointItem[]
  selectedPointId: string | null
  onSelectPoint: (point: SitePointItem) => void
  mapLayer: 'osm' | 'satellite'
}

export default function OpenStreetMapContainer({
  sitePoints,
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

      // ─── Draw Polygons over Telocor Sidoarjo ──────────────────────────────
      TELOCOR_POLYGONS.forEach((poly) => {
        const polygon = L.polygon(poly.coordinates, {
          color: poly.color,
          weight: 2,
          opacity: 0.9,
          fillColor: poly.fillColor,
          fillOpacity: poly.fillOpacity,
          dashArray: '6, 6',
        }).addTo(map)

        polygon.bindPopup(`
          <div style="font-family: inherit; font-size: 12px; padding: 4px;">
            <strong style="color: ${poly.color}; display: block; font-size: 13px;">${poly.name}</strong>
            <p style="margin: 4px 0 0 0; color: #475569; font-size: 11px;">${poly.summary}</p>
            <span style="display: inline-block; margin-top: 6px; font-weight: bold; font-size: 10px; color: #0284c7;">Lokasi: Telocor, Jabon, Sidoarjo</span>
          </div>
        `)

        polygonsRef.current.push(polygon)
      })

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
          `<div style="font-weight: bold; font-size: 11px;">${point.code}: ${point.title}</div><div style="font-size: 10px; color: #64748b;">${point.targetDesc}</div>`,
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

