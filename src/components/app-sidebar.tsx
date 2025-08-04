
"use client";

import React from 'react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from '@/components/ui/sidebar';
import { Gauge, Smartphone, Route, Milestone, Play, Square, Repeat, Settings, HelpCircle, Sun, Moon } from 'lucide-react';
import { useSpeedometer } from '@/hooks/use-speedometer';

export function AppSidebar() {
    const { 
        unit, 
        viewMode, 
        journeyStatus,
        handleUnitToggle, 
        handleViewToggle,
        handleStartJourney,
        handleEndJourney,
        handleResetJourney
    } = useSpeedometer();
    
    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-2">
                    <SidebarTrigger />
                    <h1 className="text-xl font-semibold">Velocity View</h1>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton 
                            onClick={handleViewToggle} 
                            isActive={viewMode === 'digital'}
                            tooltip="Digital View"
                        >
                            <Smartphone />
                            <span>Digital View</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton 
                            onClick={handleViewToggle} 
                            isActive={viewMode === 'analogue'}
                            tooltip="Analogue View"
                        >
                            <Gauge />
                            <span>Analogue View</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton 
                            onClick={handleUnitToggle} 
                            isActive={unit === 'kmh'}
                            tooltip="Kilometers per hour"
                        >
                            <span className="font-bold">KM/H</span>
                            <span>Kilometers</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton 
                            onClick={handleUnitToggle} 
                            isActive={unit === 'mph'}
                            tooltip="Miles per hour"
                        >
                            <span className="font-bold">MPH</span>
                            <span>Miles</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

                <SidebarMenu>
                    {journeyStatus === 'idle' && (
                        <SidebarMenuItem>
                            <SidebarMenuButton onClick={handleStartJourney} tooltip="Start Journey">
                                <Play />
                                <span>Start Journey</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}
                    {journeyStatus === 'tracking' && (
                        <SidebarMenuItem>
                            <SidebarMenuButton onClick={handleEndJourney} tooltip="End Journey">
                                <Square />
                                <span>End Journey</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}
                     {journeyStatus === 'finished' && (
                        <SidebarMenuItem>
                            <SidebarMenuButton onClick={handleResetJourney} tooltip="Reset Journey">
                                <Repeat />
                                <span>New Journey</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}
                </SidebarMenu>

            </SidebarContent>
        </Sidebar>
    );
}

    