package com.example.traffic_backend.service;

import com.example.traffic_backend.dto.DisputeRequest;
import com.example.traffic_backend.dto.ResolveDisputeRequest;
import com.example.traffic_backend.entity.*;
import com.example.traffic_backend.enums.DisputeStatus;
import com.example.traffic_backend.enums.TicketStatus;
import com.example.traffic_backend.exception.ResourceNotFoundException;
import com.example.traffic_backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DisputeService {

    private final DisputeRepository disputeRepository;

    private final ViolationTicketRepository ticketRepository;

    private final UserRepository userRepository;

    public Dispute raiseDispute(
            DisputeRequest request,
            Authentication authentication
    ) {

        ViolationTicket ticket = ticketRepository.findById(
                request.getTicketId()
        ).orElseThrow(() ->
                new ResourceNotFoundException("Ticket not found"));

        User citizen = userRepository.findByEmail(
                authentication.getName()
        ).orElseThrow(() ->
                new ResourceNotFoundException("Citizen not found"));

        ticket.setTicketStatus(TicketStatus.DISPUTED);

        ticketRepository.save(ticket);

        Dispute dispute = Dispute.builder()
                .violationTicket(ticket)
                .raisedBy(citizen)
                .disputeReason(request.getDisputeReason())
                .disputeStatus(DisputeStatus.OPEN)
                .createdAt(LocalDateTime.now())
                .build();

        return disputeRepository.save(dispute);
    }

    public List<Dispute> getAllDisputes() {

        return disputeRepository.findAll();
    }

    public Dispute resolveDispute(
            Long disputeId,
            ResolveDisputeRequest request,
            Authentication authentication
    ) {

        Dispute dispute = disputeRepository.findById(
                disputeId
        ).orElseThrow(() ->
                new ResourceNotFoundException("Dispute not found"));

        User reviewOfficer = userRepository.findByEmail(
                authentication.getName()
        ).orElseThrow(() ->
                new ResourceNotFoundException("Review officer not found"));

        ViolationTicket ticket =
                dispute.getViolationTicket();

        if(request.getStatus().equalsIgnoreCase(
                "APPROVED")) {

            dispute.setDisputeStatus(
                    DisputeStatus.APPROVED
            );

            ticket.setTicketStatus(
                    TicketStatus.CANCELLED
            );

        } else {

            dispute.setDisputeStatus(
                    DisputeStatus.REJECTED
            );

            ticket.setTicketStatus(
                    TicketStatus.PENDING_PAYMENT
            );
        }

        dispute.setResolvedBy(reviewOfficer);

        dispute.setResolutionRemark(
                request.getResolutionRemark()
        );

        dispute.setResolvedAt(LocalDateTime.now());

        ticketRepository.save(ticket);

        return disputeRepository.save(dispute);
    }
}