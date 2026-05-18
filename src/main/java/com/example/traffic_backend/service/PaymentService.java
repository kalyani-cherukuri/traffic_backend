package com.example.traffic_backend.service;

import com.example.traffic_backend.dto.PaymentRequest;
import com.example.traffic_backend.entity.PaymentTransaction;
import com.example.traffic_backend.entity.User;
import com.example.traffic_backend.entity.ViolationTicket;
import com.example.traffic_backend.enums.PaymentStatus;
import com.example.traffic_backend.enums.TicketStatus;
import com.example.traffic_backend.exception.ResourceNotFoundException;
import com.example.traffic_backend.repository.PaymentTransactionRepository;
import com.example.traffic_backend.repository.UserRepository;
import com.example.traffic_backend.repository.ViolationTicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentTransactionRepository paymentRepository;

    private final ViolationTicketRepository ticketRepository;

    private final UserRepository userRepository;

    public PaymentTransaction payFine(
            PaymentRequest request,
            Authentication authentication
    ) {

        ViolationTicket ticket = ticketRepository.findById(
                request.getTicketId()
        ).orElseThrow(() ->
                new ResourceNotFoundException("Ticket not found"));

        if(ticket.getTicketStatus() ==
                TicketStatus.PAID) {

            throw new ResourceNotFoundException(
                    "Ticket already paid"
            );
        }

        if(ticket.getTicketStatus() ==
                TicketStatus.CANCELLED) {

            throw new ResourceNotFoundException(
                    "Cancelled ticket cannot be paid"
            );
        }

        if(ticket.getDueDate().isBefore(
                LocalDate.now())) {

            ticket.setTicketStatus(
                    TicketStatus.OVERDUE
            );

            double updatedFine =
                    ticket.getFineAmount()
                    + (ticket.getFineAmount() * 0.10);

            ticket.setFineAmount(updatedFine);
        }

        String referenceId =
                "PAY-" +
                UUID.randomUUID()
                        .toString()
                        .substring(0,8);

        PaymentTransaction payment =
                PaymentTransaction.builder()
                        .violationTicket(ticket)
                        .amount(ticket.getFineAmount())
                        .paymentDate(LocalDateTime.now())
                        .paymentStatus(
                                PaymentStatus.SUCCESS
                        )
                        .referenceId(referenceId)
                        .createdAt(LocalDateTime.now())
                        .build();

        ticket.setTicketStatus(TicketStatus.PAID);

        ticketRepository.save(ticket);

        return paymentRepository.save(payment);
    }

    public List<PaymentTransaction> getAllPayments() {

        return paymentRepository.findAll();
    }

    public List<PaymentTransaction> getMyPayments(
            Authentication authentication
    ) {

        User user = userRepository.findByEmail(
                authentication.getName()
        ).orElseThrow(() ->
                new ResourceNotFoundException("User not found"));

        return paymentRepository.findAll()
                .stream()
                .filter(payment ->
                        payment.getViolationTicket()
                                .getVehicle()
                                .getOwner()
                                .getId()
                                .equals(user.getId())
                )
                .toList();
    }
}