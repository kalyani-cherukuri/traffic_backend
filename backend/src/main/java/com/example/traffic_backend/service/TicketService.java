package com.example.traffic_backend.service;

import com.example.traffic_backend.dto.TicketRequest;
import com.example.traffic_backend.entity.*;
import com.example.traffic_backend.enums.TicketStatus;
import com.example.traffic_backend.exception.ResourceNotFoundException;
import com.example.traffic_backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final ViolationTicketRepository ticketRepository;

    private final VehicleRepository vehicleRepository;

    private final ViolationTypeRepository violationTypeRepository;

    private final UserRepository userRepository;

    public ViolationTicket issueTicket(
            TicketRequest request,
            Authentication authentication
    ) {

        Vehicle vehicle = vehicleRepository.findById(
                request.getVehicleId()
        ).orElseThrow(() ->
                new ResourceNotFoundException("Vehicle not found"));

        ViolationType violationType =
                violationTypeRepository.findById(
                        request.getViolationTypeId()
                ).orElseThrow(() ->
                        new RuntimeException("Violation type not found"));

        User officer = userRepository.findByEmail(
                authentication.getName()
        ).orElseThrow();

        double fineAmount =
                violationType.getBaseFineAmount();

        String ticketNumber =
                "TKT-" +
                UUID.randomUUID()
                        .toString()
                        .substring(0,8);

        ViolationTicket ticket =
                ViolationTicket.builder()
                        .ticketNumber(ticketNumber)
                        .vehicle(vehicle)
                        .violationType(violationType)
                        .issuedBy(officer)
                        .violationDate(LocalDate.now())
                        .violationLocation(
                                request.getViolationLocation()
                        )
                        .fineAmount(fineAmount)
                        .dueDate(
                                LocalDate.now().plusDays(7)
                        )
                        .ticketStatus(
                                TicketStatus.PENDING_PAYMENT
                        )
                        .createdAt(LocalDateTime.now())
                        .build();

        return ticketRepository.save(ticket);
    }

    public List<ViolationTicket> getAllTickets() {

        return ticketRepository.findAll();
    }

    public ViolationTicket getTicketById(Long id) {

        return ticketRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Ticket not found"
                        ));
    }

    public List<ViolationTicket> getMyTickets(
            Authentication authentication
    ) {

        User citizen = userRepository.findByEmail(
                authentication.getName()
        ).orElseThrow();

        return ticketRepository
                .findByVehicleOwner(citizen);
    }
}
